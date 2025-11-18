// Script para probar el store del carrito y ver si actualiza correctamente
import { useCartStore } from '../store/cartStore';

// Simular productos para test
const testProduct1 = {
  id: "1",
  name: "Paracetamol 500mg",
  price: 1250,
  code: "PARACETAMOL-500MG",
  stock: 100,
  image: "test-image"
};

const testProduct2 = {
  id: "2", 
  name: "Ibuprofeno 400mg",
  price: 320,
  code: "IBUPROFENO-400MG",
  stock: 50,
  image: "test-image"
};

console.log('🧪 TESTING CART STORE');
console.log('====================');

// Estado inicial
console.log('📊 Estado inicial:');
console.log('  Items:', useCartStore.getState().items.length);
console.log('  Total items:', useCartStore.getState().getTotalItems());

// Agregar primer producto
console.log('\n📦 Agregando producto 1...');
useCartStore.getState().addItem(testProduct1, 2);
console.log('  Items:', useCartStore.getState().items.length);
console.log('  Total items:', useCartStore.getState().getTotalItems());
console.log('  Items details:', useCartStore.getState().items);

// Agregar segundo producto
console.log('\n📦 Agregando producto 2...');
useCartStore.getState().addItem(testProduct2, 1);
console.log('  Items:', useCartStore.getState().items.length);
console.log('  Total items:', useCartStore.getState().getTotalItems());
console.log('  Items details:', useCartStore.getState().items);

// Verificar subscribe
console.log('\n🔄 Testing subscription...');
const unsubscribe = useCartStore.subscribe((state) => {
  console.log('🔔 Store updated! Total items:', state.getTotalItems());
});

// Agregar otro producto para ver si se dispara el evento
useCartStore.getState().addItem(testProduct1, 1);

unsubscribe();