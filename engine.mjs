export const WIDTH=1200, HEIGHT=660;
const p=(x,y,w,h=24)=>({x,y,w,h});
const layouts=[
 ['Primer contacto','Mantén clic en un anclaje luminoso. Suelta para volar.',[p(0,575,290,85),p(440,515,240),p(840,575,360,85)],[[335,260],[740,240]]],
 ['Entre dos mundos','A y D dan impulso mientras cuelgas del gancho.',[p(0,575,240,85),p(400,490,190),p(770,430,180),p(1040,540,160,120)],[[295,260],[650,195],[980,235]]],
 ['Hacia arriba','Mantén W para recoger la cuerda y ganar altura.',[p(0,575,240,85),p(370,455,180),p(655,335,160),p(980,260,220)],[[300,260],[610,135],[915,80]]],
 ['La travesía','El vacío no tiene suelo. Busca tu siguiente anclaje.',[p(0,560,210,100),p(520,500,140),p(1020,550,180,110)],[[310,240],[600,200],[890,235]]],
 ['Zona de vigilancia','Evita los drones rojos. El portal siempre está a la derecha.',[p(0,565,240,95),p(400,490,180),p(740,450,160),p(1030,540,170,120)],[[300,230],[640,200],[990,230]],[[590,395,95,0.8]]],
 ['Efecto péndulo','Encadena enganches para conservar la velocidad.',[p(0,550,180,110),p(370,520,120),p(710,510,120),p(1040,510,160,150)],[[270,215],[600,170],[940,190]]],
 ['Escalera al cielo','Cada plataforma es un nuevo punto de partida.',[p(0,590,210,70),p(300,490,135),p(540,380,135),p(790,280,135),p(1050,205,150)],[[265,290],[505,160],[760,85],[1000,65]]],
 ['Cruce de señales','Espera el hueco entre los drones antes de saltar.',[p(0,560,220,100),p(420,490,150),p(730,420,150),p(1040,520,160,140)],[[300,240],[660,175],[990,220]],[[610,365,90,1],[960,400,80,1.2]]],
 ['Sin mirar abajo','Las plataformas pequeñas también guardan tu progreso.',[p(0,560,180,100),p(380,470,85),p(700,390,85),p(1040,480,160,180)],[[280,215],[600,135],[940,180]],[[560,465,80,0.9]]],
 ['El corredor','Puedes engancharte también al borde de una plataforma.',[p(0,550,200,110),p(350,470,130),p(630,370,150),p(970,290,230),p(420,130,150),p(800,95,160)],[[285,230],[590,140],[915,80]],[[780,310,65,1.1]]],
 ['Puntos suspensivos','Usa W para pasar por encima de los drones.',[p(0,570,170,90),p(470,490,90),p(800,440,90),p(1060,540,140,120)],[[270,245],[600,180],[950,190]],[[400,390,80,1.1],[740,330,75,1.3]]],
 ['Contracorriente','No necesitas recoger todos los núcleos para cruzar.',[p(0,570,200,90),p(340,430,110),p(620,530,110),p(850,370,100),p(1070,260,130)],[[265,230],[540,175],[820,150],[1030,65]],[[540,390,90,1],[940,275,65,1.4]]],
 ['Archipiélago','Un enganche preciso vale más que un salto largo.',[p(0,560,160,100),p(320,500,80),p(590,420,80),p(850,350,80),p(1090,440,110,220)],[[240,260],[500,160],[760,100],[1030,140]],[[470,405,65,1.2],[760,330,75,1.4]]],
 ['A un hilo','El último tramo exige altura, ritmo y paciencia.',[p(0,590,180,70),p(360,465,85),p(650,340,90),p(920,440,80),p(1090,275,110)],[[270,260],[570,130],[850,105],[1060,70]],[[480,350,60,1.2],[810,300,75,1.5],[1010,385,45,1.3]]],
 ['Órbita libre','Todo lo que has aprendido, en un último vuelo.',[p(0,580,160,80),p(330,470,75),p(610,370,75),p(880,290,75),p(1090,220,110)],[[245,245],[510,150],[790,85],[1030,50]],[[460,370,70,1.2],[740,280,65,1.4],[1000,200,45,1.6]]]
];
export const levels=layouts.map(([name,tip,platforms,anchors,drones=[]],i)=>{const last=platforms.find(q=>q.x+q.w===1200);return {name,tip,platforms,anchors:anchors.map(([x,y])=>({x,y})),drones:drones.map(([x,y,range,speed])=>({x,y,range,speed})),spawn:{x:75,y:platforms[0].y-17},exit:{x:1147,y:last.y-36},cores:[0,1,2].map((_,j)=>{const a=anchors[Math.min(j,anchors.length-1)];return {x:a[0]+(j===2&&anchors.length===2?110:0),y:a[1]+100+(j===2?40:0)}}),index:i}});
export function createState(index=0){const level=levels[index];return {level,player:{...level.spawn,vx:0,vy:0,r:15,grounded:false},rope:null,elapsed:0,deaths:0,collected:new Set(),checkpoint:{...level.spawn},checkpointIndex:-1,won:false,flash:0,trail:[]}}
export function dronePosition(d,t){return {x:d.x+Math.sin(t*d.speed)*d.range,y:d.y+Math.cos(t*d.speed*.8)*14}}
function segmentRect(x,y,dx,dy,q){let lo=0,hi=1;for(const [o,d,min,max] of [[x,dx,q.x,q.x+q.w],[y,dy,q.y,q.y+q.h]]){if(Math.abs(d)<1e-8){if(o<min||o>max)return null}else{let a=(min-o)/d,b=(max-o)/d;if(a>b)[a,b]=[b,a];lo=Math.max(lo,a);hi=Math.min(hi,b);if(lo>hi)return null}}return lo}
export function hook(s,x,y,auto=false){const b=s.player;let target=null,dist=Infinity;for(const a of s.level.anchors){const d=Math.hypot(a.x-b.x,a.y-b.y),aim=Math.hypot(a.x-x,a.y-y);if(d<=555&&(auto? a.y<b.y+40:aim<48)){const score=auto?d:aim;if(score<dist){target={...a};dist=score}}}if(!target&&!auto){const dx=x-b.x,dy=y-b.y,l=Math.hypot(dx,dy);if(l<1)return false;let best=1;for(const q of s.level.platforms){const t=segmentRect(b.x,b.y,dx/l*555,dy/l*555,q);if(t!==null&&t>0.025&&t<best){best=t;target={x:b.x+dx/l*555*t,y:b.y+dy/l*555*t}}}}if(!target)return false;
// An earlier platform blocks an anchor behind it.
for(const q of s.level.platforms){const t=segmentRect(b.x,b.y,target.x-b.x,target.y-b.y,q);if(t!==null&&t>0.025&&t<.985){target={x:b.x+(target.x-b.x)*t,y:b.y+(target.y-b.y)*t};break}}
s.rope={...target,length:Math.max(42,Math.hypot(target.x-b.x,target.y-b.y))};b.vy-=35;return true}
export function respawn(s){s.deaths++;Object.assign(s.player,s.checkpoint,{vx:0,vy:0,grounded:false});s.rope=null;s.flash=.35;s.trail=[]}
export function step(s,input,dt){if(s.won)return;dt=Math.min(dt,1/60);s.elapsed+=dt;s.flash=Math.max(0,s.flash-dt);const b=s.player,oldY=b.y;const dir=(input.right?1:0)-(input.left?1:0);b.vx+=dir*(b.grounded?2300:1050)*dt;if(!dir)b.vx*=Math.exp(-(b.grounded?10:.25)*dt);b.vx=Math.max(-690,Math.min(690,b.vx));if(input.jump&&b.grounded){b.vy=-540;b.grounded=false}b.vy=Math.min(1000,b.vy+1390*dt);
if(s.rope&&input.reel)s.rope.length=Math.max(42,s.rope.length-190*dt);
b.x+=b.vx*dt;b.x=Math.max(b.r,Math.min(WIDTH-b.r,b.x));for(const q of s.level.platforms){if(b.y+b.r>q.y+4&&b.y-b.r<q.y+q.h-4&&b.x+b.r>q.x&&b.x-b.r<q.x+q.w){if(b.vx>0)b.x=q.x-b.r;else if(b.vx<0)b.x=q.x+q.w+b.r;b.vx=0}}
b.y+=b.vy*dt;if(s.rope){const r=s.rope,dx=b.x-r.x,dy=b.y-r.y,d=Math.hypot(dx,dy);if(d>r.length){const nx=dx/d,ny=dy/d;b.x=r.x+nx*r.length;b.y=r.y+ny*r.length;const v=b.vx*nx+b.vy*ny;if(v>0){b.vx-=v*nx;b.vy-=v*ny}}}
b.grounded=false;for(let i=0;i<s.level.platforms.length;i++){const q=s.level.platforms[i];if(b.x+b.r>q.x+2&&b.x-b.r<q.x+q.w-2&&b.y+b.r>q.y&&b.y-b.r<q.y+q.h){if(oldY+b.r<=q.y+12&&b.vy>=0){b.y=q.y-b.r;b.vy=0;b.grounded=true;if(i>0&&q.x<1000&&i>s.checkpointIndex){s.checkpoint={x:q.x+q.w/2,y:q.y-b.r};s.checkpointIndex=i}}else if(oldY-b.r>=q.y+q.h-8&&b.vy<0){b.y=q.y+q.h+b.r;b.vy=0}else{b.x=b.x<q.x+q.w/2?q.x-b.r:q.x+q.w+b.r;b.vx=0}}}
for(let i=0;i<3;i++){const c=s.level.cores[i];if(Math.hypot(c.x-b.x,c.y-b.y)<28)s.collected.add(i)}
if(b.y>HEIGHT+45||s.level.drones.some(d=>{const a=dronePosition(d,s.elapsed);return Math.hypot(a.x-b.x,a.y-b.y)<29})){respawn(s);return}if(Math.abs(b.x-s.level.exit.x)<30&&Math.abs(b.y-s.level.exit.y)<49)s.won=true;
s.trail.push({x:b.x,y:b.y});if(s.trail.length>14)s.trail.shift()}
