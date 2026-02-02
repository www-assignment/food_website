// Backup and Sync System
const BackupSync = {
    // Sync localStorage orders with Firebase
    syncOrdersToFirebase: async function() {
        try {
            const currentUser = firebase.auth().currentUser;
            if (!currentUser) return;
            
            // Sync premium builder orders
            const premiumOrders = JSON.parse(localStorage.getItem('ceoGrillsPremiumOrders') || '[]');
            for (const order of premiumOrders) {
                if (!order.syncedToFirebase) {
                    await this.syncSingleOrder(order, 'premium-builder');
                }
            }
            
            // Sync checkout orders
            const checkoutOrders = JSON.parse(localStorage.getItem('ceoGrillsCheckoutOrders') || '[]');
            for (const order of checkoutOrders) {
                if (!order.syncedToFirebase) {
                    await this.syncSingleOrder(order, 'checkout');
                }
            }
            
            console.log('✅ Orders synced to Firebase');
        } catch (error) {
            console.error('Error syncing orders:', error);
        }
    },
    
    syncSingleOrder: async function(order, type) {
        try {
            const db = firebase.firestore();
            
            // Prepare order data for Firebase
            const firebaseOrder = {
                ...order,
                type: type,
                syncedToFirebase: true,
                syncDate: new Date().toISOString(),
                createdAt: order.createdAt ? new Date(order.createdAt) : firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Use orderId as document ID
            const orderId = order.orderId || `${type}-local-${Date.now()}`;
            await db.collection('orders').doc(orderId).set(firebaseOrder);
            
            // Mark as synced in localStorage
            order.syncedToFirebase = true;
            
            return true;
        } catch (error) {
            console.error('Error syncing single order:', error);
            return false;
        }
    }
};

// Auto-sync when user is logged in
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        setTimeout(() => {
            BackupSync.syncOrdersToFirebase();
        }, 3000);
    }
});