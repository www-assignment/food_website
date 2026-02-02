// ===== ENHANCED ORDER SYSTEM WITH FIREBASE =====
// This handles saving ALL order data from premium builder and checkout

const EnhancedOrderSystem = {
    // Initialize order system
    init: function() {
        console.log('🛒 Enhanced Order System Initializing...');
        
        // Listen for auth state changes
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log('✅ User logged in for order system:', user.email);
                this.currentUser = user;
            } else {
                console.log('⚠️ No user logged in for order system');
                this.currentUser = null;
            }
        });
    },

    // Get current user
    currentUser: null,

    // Save premium builder order
    savePremiumBuilderOrder: async function(orderData) {
        try {
            if (!this.currentUser) {
                console.warn('No user logged in, saving to localStorage only');
                return this.saveToLocalStorage(orderData, 'premium-builder');
            }

            const db = firebase.firestore();
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            
            const order = {
                type: 'premium-builder',
                userId: this.currentUser.uid,
                userEmail: this.currentUser.email,
                userName: this.currentUser.displayName || this.currentUser.email.split('@')[0],
                orderId: 'PB-' + Date.now().toString().slice(-8),
                ...orderData,
                createdAt: timestamp,
                updatedAt: timestamp,
                status: 'pending',
                source: 'premium-builder'
            };

            // Save to Firestore
            await db.collection('orders').doc(order.orderId).set(order);
            
            // Also save to localStorage as backup
            this.saveToLocalStorage(order, 'premium-builder');

            console.log('✅ Premium builder order saved:', order.orderId);
            return {
                success: true,
                orderId: order.orderId,
                orderData: order
            };

        } catch (error) {
            console.error('❌ Error saving premium builder order:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Save checkout order (includes everything from checkout form)
    saveCheckoutOrder: async function(orderData) {
        try {
            if (!this.currentUser) {
                console.warn('No user logged in, saving to localStorage only');
                return this.saveToLocalStorage(orderData, 'checkout');
            }

            const db = firebase.firestore();
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            
            const order = {
                type: 'checkout',
                userId: this.currentUser.uid,
                userEmail: this.currentUser.email,
                userName: this.currentUser.displayName || this.currentUser.email.split('@')[0],
                orderId: 'CHK-' + Date.now().toString().slice(-8),
                ...orderData,
                createdAt: timestamp,
                updatedAt: timestamp,
                status: 'pending',
                requiresVerification: orderData.paymentMethod === 'bank',
                source: 'checkout'
            };

            // Save to Firestore
            await db.collection('orders').doc(order.orderId).set(order);
            
            // Also save to localStorage as backup
            this.saveToLocalStorage(order, 'checkout');

            // Update user stats
            await this.updateUserStats(this.currentUser.uid, orderData.total || 0);

            console.log('✅ Checkout order saved:', order.orderId);
            return {
                success: true,
                orderId: order.orderId,
                orderData: order
            };

        } catch (error) {
            console.error('❌ Error saving checkout order:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Update user statistics
    updateUserStats: async function(userId, orderTotal) {
        try {
            const db = firebase.firestore();
            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();

            if (userDoc.exists) {
                const userData = userDoc.data();
                const currentOrders = userData.totalOrders || 0;
                const currentSpent = userData.totalSpent || 0;

                await userRef.update({
                    totalOrders: currentOrders + 1,
                    totalSpent: currentSpent + parseFloat(orderTotal),
                    lastOrderDate: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            } else {
                await userRef.set({
                    userId: userId,
                    totalOrders: 1,
                    totalSpent: parseFloat(orderTotal),
                    firstOrderDate: firebase.firestore.FieldValue.serverTimestamp(),
                    lastOrderDate: firebase.firestore.FieldValue.serverTimestamp(),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            console.log('✅ User stats updated for:', userId);
        } catch (error) {
            console.error('Error updating user stats:', error);
        }
    },

    // Save to localStorage as backup
    saveToLocalStorage: function(order, type) {
        try {
            const key = type === 'premium-builder' ? 'ceoGrillsPremiumOrders' : 'ceoGrillsCheckoutOrders';
            const orders = JSON.parse(localStorage.getItem(key) || '[]');
            
            orders.push(order);
            localStorage.setItem(key, JSON.stringify(orders));
            
            console.log(`✅ Order saved to localStorage (${type})`);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    // Get all orders (for admin panel)
    getAllOrders: async function() {
        try {
            const db = firebase.firestore();
            const snapshot = await db.collection('orders')
                .orderBy('createdAt', 'desc')
                .get();

            const orders = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                orders.push({
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date()
                });
            });

            return orders;
        } catch (error) {
            console.error('Error getting all orders:', error);
            return [];
        }
    },

    // Get orders by user
    getUserOrders: async function(userId) {
        try {
            const db = firebase.firestore();
            const snapshot = await db.collection('orders')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();

            const orders = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                orders.push({
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date()
                });
            });

            return orders;
        } catch (error) {
            console.error('Error getting user orders:', error);
            return [];
        }
    },

    // Update order status (for admin)
    updateOrderStatus: async function(orderId, status, notes = '') {
        try {
            const db = firebase.firestore();
            await db.collection('orders').doc(orderId).update({
                status: status,
                adminNotes: notes,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedBy: 'admin'
            });

            console.log(`✅ Order ${orderId} status updated to ${status}`);
            return { success: true };
        } catch (error) {
            console.error('Error updating order status:', error);
            return { success: false, error: error.message };
        }
    },

    // Verify payment (for admin)
    verifyPayment: async function(orderId, verified = true, notes = '') {
        try {
            const db = firebase.firestore();
            await db.collection('orders').doc(orderId).update({
                paymentVerified: verified,
                paymentVerifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
                paymentVerifiedBy: 'admin',
                paymentVerificationNotes: notes,
                status: verified ? 'confirmed' : 'payment_failed',
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log(`✅ Payment for order ${orderId} ${verified ? 'verified' : 'rejected'}`);
            return { success: true };
        } catch (error) {
            console.error('Error verifying payment:', error);
            return { success: false, error: error.message };
        }
    },

    // Get order statistics
    getOrderStats: async function() {
        try {
            const db = firebase.firestore();
            const orders = await this.getAllOrders();
            
            const stats = {
                totalOrders: orders.length,
                pending: orders.filter(o => o.status === 'pending').length,
                confirmed: orders.filter(o => o.status === 'confirmed').length,
                completed: orders.filter(o => o.status === 'completed').length,
                cancelled: orders.filter(o => o.status === 'cancelled').length,
                awaitingVerification: orders.filter(o => o.status === 'awaiting_verification').length,
                totalRevenue: orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0),
                premiumBuilderOrders: orders.filter(o => o.type === 'premium-builder').length,
                checkoutOrders: orders.filter(o => o.type === 'checkout').length
            };

            return stats;
        } catch (error) {
            console.error('Error getting order stats:', error);
            return null;
        }
    }
};

// Initialize when Firebase is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            EnhancedOrderSystem.init();
            window.EnhancedOrderSystem = EnhancedOrderSystem;
            console.log('✅ Enhanced Order System Ready');
        }
    }, 1000);
});







// Add this to your firebase-orders.js file

// Initialize Firebase Storage
const storage = firebase.storage();

// Function to upload payment proof file
async function uploadPaymentProofFile(file, orderId, userId) {
    try {
        // Create a unique filename
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const fileName = `payment-proofs/${orderId}/${userId}_${timestamp}.${fileExtension}`;
        
        // Create storage reference
        const storageRef = storage.ref(fileName);
        
        // Upload file
        const snapshot = await storageRef.put(file);
        
        // Get download URL
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        return {
            success: true,
            fileName: fileName,
            downloadURL: downloadURL,
            fileType: file.type,
            fileSize: file.size
        };
        
    } catch (error) {
        console.error('Error uploading file:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Function to get payment proof file URL
async function getPaymentProofURL(fileName) {
    try {
        const storageRef = storage.ref(fileName);
        const downloadURL = await storageRef.getDownloadURL();
        return downloadURL;
    } catch (error) {
        console.error('Error getting file URL:', error);
        return null;
    }
}

// Add these functions to the EnhancedOrderSystem object
EnhancedOrderSystem.uploadPaymentProofFile = uploadPaymentProofFile;
EnhancedOrderSystem.getPaymentProofURL = getPaymentProofURL;