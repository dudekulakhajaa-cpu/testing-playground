import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT || 4173);
const here = path.dirname(fileURLToPath(import.meta.url));
const products = [
  ['Wireless Headphones','Electronics',79.99,18,4.6],['Desk Lamp','Home',34.5,0,4.2],['Travel Backpack','Accessories',59,12,4.8],['Ceramic Mug Set','Home',24.99,31,4.4],['USB-C Hub','Electronics',45,7,4.1],['Notebook Pack','Stationery',12.75,44,4.7],['Mechanical Keyboard','Electronics',99.95,5,4.9],['Reusable Bottle','Accessories',19.5,26,4.3],['Plant Pot','Home',16,9,3.9],['Webcam HD','Electronics',64,14,4.5],['Canvas Tote','Accessories',14,21,4],['Gel Pen Set','Stationery',8.5,62,4.6]
].map(([name,category,price,stock,rating],i)=>({id:101+i,name,category,price,stock,rating,status:stock===0?'Out of stock':stock<8?'Low stock':'Active'}));
let nextId=113;
const orders=[
  {id:'ORD-2841',customer:'Maya Patel',email:'maya@example.com',total:124.49,status:'Delivered',date:'2026-10-28'},
  {id:'ORD-2840',customer:'Noah Kim',email:'noah@example.com',total:79.99,status:'Processing',date:'2026-10-27'},
  {id:'ORD-2839',customer:'Sofia Chen',email:'sofia@example.com',total:45,status:'Shipped',date:'2026-10-27'},
  {id:'ORD-2838',customer:'Liam Johnson',email:'liam@example.com',total:68.5,status:'Cancelled',date:'2026-10-26'},
  {id:'ORD-2837',customer:'Ava Williams',email:'ava@example.com',total:99.95,status:'Processing',date:'2026-10-25'},
  {id:'ORD-2836',customer:'Ethan Brown',email:'ethan@example.com',total:24.99,status:'Delivered',date:'2026-10-24'}
];
const users=[{id:1,name:'Alex Morgan',email:'alex@example.com',role:'Admin',active:true},{id:2,name:'Jamie Rivera',email:'jamie@example.com',role:'Editor',active:true},{id:3,name:'Taylor Singh',email:'taylor@example.com',role:'Viewer',active:false}];

app.use(express.json({limit:'1mb'}));
app.use((req,res,next)=>{res.set('Access-Control-Allow-Origin','*');res.set('Access-Control-Allow-Headers','Content-Type');res.set('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE,OPTIONS');if(req.method==='OPTIONS')return res.sendStatus(204);next()});
app.use('/api',async(req,res,next)=>{const delay=Math.min(5000,Math.max(0,Number(req.query.delay)||0));if(delay)await new Promise(r=>setTimeout(r,delay));if(req.query.scenario==='error')return res.status(500).json({error:'Simulated server error',message:'This response was intentionally triggered for testing.'});if(req.query.scenario==='unauthorized')return res.status(401).json({error:'Unauthorized',message:'A valid session is required.'});next()});
app.get('/api/health',(req,res)=>res.json({status:'ok',service:'Testing Playground API',timestamp:new Date().toISOString()}));
app.post('/api/auth/login',(req,res)=>req.body.email==='student@example.com'&&req.body.password==='Password123!'?res.json({token:'demo-token-abc123',user:{name:'Student User',email:req.body.email,role:'Admin'}}):res.status(401).json({error:'Invalid credentials',message:'Check the demo credentials and try again.'}));
app.get('/api/products',(req,res)=>{let rows=[...products],q=String(req.query.q||'').toLowerCase(),category=req.query.category;if(q)rows=rows.filter(p=>`${p.name} ${p.category}`.toLowerCase().includes(q));if(category&&category!=='All')rows=rows.filter(p=>p.category===category);const page=Math.max(1,Number(req.query.page)||1),limit=Math.min(100,Math.max(1,Number(req.query.limit)||6));res.json({data:rows.slice((page-1)*limit,page*limit),page,limit,total:rows.length,totalPages:Math.max(1,Math.ceil(rows.length/limit))})});
const valid=p=>p.name&&p.category&&Number.isFinite(Number(p.price))&&Number(p.price)>0&&Number.isInteger(Number(p.stock))&&Number(p.stock)>=0;
app.post('/api/products',(req,res)=>{const b=req.body;if(!valid(b))return res.status(400).json({error:'Validation failed',fields:{name:'Required',price:'Must be greater than 0',stock:'Must be a non-negative integer'}});const p={id:nextId++,name:String(b.name).trim(),category:String(b.category),price:Number(b.price),stock:Number(b.stock),rating:0,status:Number(b.stock)?'Active':'Out of stock'};products.unshift(p);res.status(201).json(p)});
app.get('/api/products/:id',(req,res)=>{const p=products.find(x=>x.id===Number(req.params.id));p?res.json(p):res.status(404).json({error:'Product not found'})});
app.put('/api/products/:id',(req,res)=>{const i=products.findIndex(x=>x.id===Number(req.params.id));if(i<0)return res.status(404).json({error:'Product not found'});if(!valid(req.body))return res.status(400).json({error:'Validation failed'});products[i]={...products[i],...req.body,price:Number(req.body.price),stock:Number(req.body.stock)};res.json(products[i])});
app.delete('/api/products/:id',(req,res)=>{const i=products.findIndex(x=>x.id===Number(req.params.id));if(i<0)return res.status(404).json({error:'Product not found'});const [deleted]=products.splice(i,1);res.json({deleted:true,data:deleted})});
app.get('/api/orders',(req,res)=>res.json({data:orders,total:orders.length}));app.get('/api/users',(req,res)=>res.json({data:users,total:users.length}));app.post('/api/echo',(req,res)=>res.json({received:req.body,timestamp:new Date().toISOString()}));app.get('/api/not-found',(req,res)=>res.status(404).json({error:'Not found',message:'This endpoint intentionally returns 404.'}));
app.use('/api',(req,res)=>res.status(404).json({error:'Unknown endpoint',path:req.path}));
const dist=path.resolve(here,'../dist');app.use(express.static(dist));app.use((req,res,next)=>req.path.startsWith('/api')?next():res.sendFile(path.join(dist,'index.html')));
app.listen(port,()=>console.log(`TestLab listening on http://localhost:${port}`));
