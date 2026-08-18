import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const C = { orange: '#FF704F', ink: '#111111', muted: '#777477', line: '#E9E4E2', bg: '#FFFFFF', pink: '#FFE0E2', green: '#D6F7D5', lilac: '#E9E7FF', yellow: '#FFF6BE' };
const image = id => ({ uri: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=500&q=80` });
const PRODUCTS = [
  { id: '1', name: "Kawasaki Men's Fishing T-Shirt", category: 'Fashion', price: 15.99, rating: 4.7, color: C.green, image: image('photo-1521572163474-6864f9cf17ab') },
  { id: '2', name: 'Smart Ultrasonic Wrist Watch', category: 'Electronics', price: 39.99, rating: 4.8, color: C.lilac, image: image('photo-1523275335684-37898b6baf30') },
  { id: '3', name: 'Nike Air Max Sneakers', category: 'Fashion', price: 47.99, rating: 4.9, color: C.pink, image: image('photo-1542291026-7eec264c27ff') },
  { id: '4', name: 'Wireless Portable Speaker', category: 'Electronics', price: 25.99, rating: 4.6, color: C.pink, image: image('photo-1608043152269-423dbba4e7e1') },
  { id: '5', name: 'Classic Leather Handbag', category: 'Fashion', price: 28.99, rating: 4.5, color: C.yellow, image: image('photo-1584917865442-de89df76afd3') },
  { id: '6', name: 'Ladies Running Shoes', category: 'Fashion', price: 35.99, rating: 4.8, color: C.green, image: image('photo-1549298916-b41d501d3772') },
];

function ProductCard({ image, name, price, rating, color, onPress }) {
  return <Pressable onPress={onPress} style={[styles.card, { backgroundColor: color }]}>
    <Image source={image} style={styles.cardImage} /><Text numberOfLines={2} style={styles.productName}>{name}</Text>
    <Text style={styles.rating}>★ {rating.toFixed(1)}</Text><Text style={styles.price}>${price.toFixed(2)}</Text>
  </Pressable>;
}
function Button({ children, onPress }) { return <Pressable onPress={onPress} style={styles.button}><Text style={styles.buttonText}>{children}</Text></Pressable>; }

function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const products = PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  return <View style={styles.screen}><ScrollView contentContainerStyle={styles.scroll}>
    <Text style={styles.logo}>Galaxy Shop</Text><Text style={styles.heading}>Find your favourite products</Text>
    <View style={styles.search}><Ionicons name="search-outline" size={18} color={C.muted} /><TextInput placeholder="Search products" value={query} onChangeText={setQuery} style={styles.searchInput} /></View>
    <View style={styles.banner}><Text style={styles.bannerTitle}>Free delivery{`\n`}for your first item</Text><Ionicons name="bicycle-outline" size={56} color="#612D1D" /></View>
    <Text style={styles.sectionTitle}>Popular products</Text><View style={styles.grid}>{products.map(p => <ProductCard key={p.id} {...p} onPress={() => navigation.navigate('ProductDetails', { product: p })} />)}</View>
  </ScrollView></View>;
}

function ProductDetailsScreen({ route, navigation, addCart }) {
  const { product } = route.params; const [quantity, setQuantity] = useState(1);
  return <View style={styles.screen}><ScrollView contentContainerStyle={styles.scroll}>
    <Pressable onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="chevron-back" size={22} /><Text>Back</Text></Pressable>
    <View style={[styles.detailImageWrap, { backgroundColor: product.color }]}><Image source={product.image} style={styles.detailImage} /></View>
    <Text style={styles.detailName}>{product.name}</Text><Text style={styles.rating}>★ {product.rating.toFixed(1)} / 5</Text><Text style={styles.detailPrice}>${product.price.toFixed(2)}</Text>
    <Text style={styles.sectionTitle}>Description</Text><Text style={styles.description}>High quality product made for everyday use. A comfortable, stylish choice with excellent value.</Text>
    <Text style={styles.sectionTitle}>Quantity</Text><View style={styles.quantity}><Pressable onPress={() => setQuantity(Math.max(1, quantity - 1))}><Text style={styles.quantityButton}>−</Text></Pressable><Text>{quantity}</Text><Pressable onPress={() => setQuantity(quantity + 1)}><Text style={styles.quantityButton}>+</Text></Pressable></View>
    <Button onPress={() => addCart(product, quantity)}>Add to Cart</Button>
  </ScrollView></View>;
}

function CartScreen({ cart, setCart }) {
  const change = (id, delta) => setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <View style={styles.screen}><ScrollView contentContainerStyle={styles.scroll}><Text style={styles.heading}>Your Cart</Text>
    {cart.length === 0 ? <Text style={styles.empty}>Your cart is empty.</Text> : cart.map(item => <View key={item.id} style={styles.cartItem}><Image source={item.image} style={styles.cartImage} /><View style={{ flex: 1 }}><Text style={styles.productName}>{item.name}</Text><Text style={styles.price}>${item.price.toFixed(2)}</Text><View style={styles.quantity}><Pressable onPress={() => change(item.id, -1)}><Text>−</Text></Pressable><Text>{item.quantity}</Text><Pressable onPress={() => change(item.id, 1)}><Text>+</Text></Pressable></View></View><Pressable onPress={() => setCart(cart.filter(x => x.id !== item.id))}><Ionicons name="trash-outline" size={20} color={C.orange} /></Pressable></View>)}
    <View style={styles.total}><Text>Subtotal</Text><Text style={styles.detailPrice}>${total.toFixed(2)}</Text></View>
  </ScrollView></View>;
}
function ProfileScreen() { return <View style={styles.screen}><View style={styles.profile}><Ionicons name="person-circle-outline" size={90} color={C.orange} /><Text style={styles.heading}>My Profile</Text><Text style={styles.description}>Manage your Galaxy Shop account.</Text></View></View>; }
function ShopTabs({ cart, setCart }) { return <Tabs.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: C.orange, tabBarIcon: ({ color, size }) => <Ionicons name={route.name === 'Home' ? 'home-outline' : route.name === 'Cart' ? 'cart-outline' : 'person-outline'} size={size} color={color} /> })}><Tabs.Screen name="Home" component={HomeScreen} /><Tabs.Screen name="Cart">{props => <CartScreen {...props} cart={cart} setCart={setCart} />}</Tabs.Screen><Tabs.Screen name="Profile" component={ProfileScreen} /></Tabs.Navigator>; }

export default function App() {
  const [cart, setCart] = useState([]);
  const addCart = (product, quantity) => setCart(current => current.some(item => item.id === product.id) ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) : [...current, { ...product, quantity }]);
  return <NavigationContainer><Stack.Navigator><Stack.Screen name="Shop" options={{ headerShown: false }}>{props => <ShopTabs {...props} cart={cart} setCart={setCart} />}</Stack.Screen><Stack.Screen name="ProductDetails" options={{ title: 'Product Details' }}>{props => <ProductDetailsScreen {...props} addCart={addCart} />}</Stack.Screen></Stack.Navigator></NavigationContainer>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: C.bg }, scroll: { padding: 18, paddingBottom: 32 }, logo: { fontSize: 22, fontWeight: '900', color: C.orange, marginBottom: 22 }, heading: { fontSize: 24, fontWeight: '900', color: C.ink, marginBottom: 16 }, search: { height: 42, borderWidth: 1, borderColor: C.line, borderRadius: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginBottom: 18 }, searchInput: { flex: 1, marginLeft: 8 }, banner: { backgroundColor: C.orange, borderRadius: 10, padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }, bannerTitle: { fontSize: 18, fontWeight: '900' }, sectionTitle: { fontSize: 17, fontWeight: '900', marginTop: 18, marginBottom: 12 }, grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }, card: { width: '48%', borderRadius: 9, padding: 10, marginBottom: 12, minHeight: 190 }, cardImage: { width: '100%', height: 100, resizeMode: 'contain', marginBottom: 8 }, productName: { fontSize: 12, fontWeight: '700', lineHeight: 16 }, rating: { color: '#D99800', fontSize: 12, marginTop: 5 }, price: { fontSize: 15, fontWeight: '900', marginTop: 4 }, back: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 }, detailImageWrap: { height: 280, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, detailImage: { width: '85%', height: '85%', resizeMode: 'contain' }, detailName: { fontSize: 22, fontWeight: '900', marginTop: 18 }, detailPrice: { fontSize: 22, fontWeight: '900', marginTop: 8 }, description: { fontSize: 13, color: C.muted, lineHeight: 20 }, quantity: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 125, borderWidth: 1, borderColor: C.line, borderRadius: 7, padding: 10, marginVertical: 8 }, quantityButton: { fontSize: 20, fontWeight: '800' }, button: { height: 44, backgroundColor: C.ink, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 18 }, buttonText: { color: '#fff', fontWeight: '800' }, cartItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: C.line }, cartImage: { width: 64, height: 64, resizeMode: 'contain', backgroundColor: C.pink, borderRadius: 7, marginRight: 12 }, total: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 24, borderTopWidth: 1, borderColor: C.line, marginTop: 20 }, empty: { textAlign: 'center', color: C.muted, marginTop: 80 }, profile: { alignItems: 'center', padding: 40, marginTop: 80 } });
