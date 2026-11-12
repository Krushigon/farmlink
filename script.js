const seed=[
{id:1,n:'Fresh Tomatoes',c:'Vegetables',p:32,q:40,f:'Ravi',e:'🍅'},
{id:2,n:'Farm Carrots',c:'Vegetables',p:45,q:25,f:'Lakshmi',e:'🥕'},
{id:3,n:'Sweet Bananas',c:'Fruits',p:50,q:60,f:'Manjunath',e:'🍌'},
{id:4,n:'Fresh Mangoes',c:'Fruits',p:85,q:30,f:'Kiran',e:'🥭'},
{id:5,n:'Local Rice',c:'Grains',p:48,q:100,f:'Shankar',e:'🌾'},
{id:6,n:'Green Spinach',c:'Vegetables',p:25,q:20,f:'Geetha',e:'🥬'},
{id:7,n:'Sweet Corn',c:'Vegetables',p:28,q:35,f:'Ramesh',e:'🌽'},
{id:8,n:'Fresh Papaya',c:'Fruits',p:38,q:22,f:'Suma',e:'🍈'}];
let products=JSON.parse(localStorage.getItem('fd_products')||'null')||seed;
let cart=JSON.parse(localStorage.getItem('fd_cart')||'[]');
const $=id=>document.getElementById(id), save=()=>{localStorage.setItem('fd_products',JSON.stringify(products));localStorage.setItem('fd_cart',JSON.stringify(cart))};
function safe(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2200)}
function render(){
 const q=$('search').value.toLowerCase(),cat=$('category').value;
 const list=products.filter(x=>(cat==='All'||x.c===cat)&&x.n.toLowerCase().includes(q));
 $('products').innerHTML=list.length?list.map(x=>`<article class="card"><div class="photo">${x.img?`<img src="${safe(x.img)}" onerror="this.remove();this.parentElement.textContent='🌱'">`:x.e}</div><h3>${safe(x.n)}</h3><p>👨‍🌾 ${safe(x.f)} · ${safe(x.c)}</p><p>${x.q} kg available</p><div class="bottom"><b>₹${x.p}/kg</b><button data-add="${x.id}">＋ Add</button></div></article>`).join(''):'<p>No products found.</p>';
 document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>add(+b.dataset.add));renderCart();
}
function add(id){let x=cart.find(i=>i.id===id);if(x)x.q++;else cart.push({id,q:1});save();renderCart();toast('Added to cart')}
function renderCart(){
 $('count').textContent=cart.reduce((a,x)=>a+x.q,0);
 $('cartItems').innerHTML=cart.length?cart.map(i=>{let p=products.find(x=>x.id===i.id);return p?`<div class="cartrow"><span>${safe(p.n)} × ${i.q}</span><b>₹${p.p*i.q}</b><button data-remove="${p.id}">Remove</button></div>`:''}).join(''):'<p>Your cart is empty.</p>';
 $('total').textContent='Total: ₹'+cart.reduce((a,i)=>{let p=products.find(x=>x.id===i.id);return a+(p?p.p*i.q:0)},0);
 document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==+b.dataset.remove);save();renderCart()});
}
function open(id){$(id).classList.add('open')}function close(id){$(id).classList.remove('open')}
$('search').oninput=render;$('category').onchange=render;
$('productForm').onsubmit=e=>{e.preventDefault();products.unshift({id:Date.now(),n:$('product').value.trim(),c:$('kind').value,p:+$('price').value,q:+$('qty').value,f:$('farmer').value.trim(),img:$('photo').value.trim(),e:'🌱'});save();render();e.target.reset();toast('Product listed!')};
$('priceRows').innerHTML=[['Tomato','Mysuru sample','₹32/kg'],['Onion','Mysuru sample','₹28/kg'],['Potato','Mysuru sample','₹25/kg'],['Rice','Mysuru sample','₹48/kg'],['Banana','Mysuru sample','₹50/kg']].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');
$('weatherBtn').onclick=()=>{$('temp').textContent='28°C';$('condition').textContent='Partly cloudy · '+$('town').value;$('humidity').textContent='68%';$('wind').textContent='12 km/h';$('rain').textContent='30%';toast('Demo weather loaded')};
$('cartBtn').onclick=()=>open('cartModal');$('loginBtn').onclick=()=>open('loginModal');
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>close(b.dataset.close));
document.querySelectorAll('.shade').forEach(m=>m.onclick=e=>{if(e.target===m)close(m.id)});
$('checkout').onclick=()=>{if(!cart.length){toast('Your cart is empty');return}close('cartModal');open('checkoutModal')};
$('checkoutForm').onsubmit=e=>{e.preventDefault();alert('Demo order placed! No payment was collected.');cart=[];save();renderCart();e.target.reset();close('checkoutModal');toast('Demo order confirmed')};
$('continue').onclick=()=>{let n=$('userName').value.trim();if(!n){toast('Enter your name');return}localStorage.setItem('fd_user',JSON.stringify({name:n,role:$('role').value}));$('loginBtn').textContent=n.split(' ')[0];close('loginModal');toast('Welcome '+n)};
let u=JSON.parse(localStorage.getItem('fd_user')||'null');if(u)$('loginBtn').textContent=u.name.split(' ')[0];render();