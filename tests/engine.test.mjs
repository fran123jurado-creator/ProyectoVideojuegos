import test from 'node:test';
import assert from 'node:assert/strict';
import {levels,createState,step,hook,respawn,dronePosition} from '../engine.mjs';
const advance=(s,n,input={})=>{for(let i=0;i<n;i++)step(s,input,1/120)};
test('15 sectores completos con salida apoyada y anclajes a distancias utilizables',()=>{
 assert.equal(levels.length,15);assert.equal(new Set(levels.map(l=>l.name)).size,15);
 for(const l of levels){assert.equal(l.cores.length,3);assert(l.platforms.some(p=>l.exit.x>=p.x&&l.exit.x<=p.x+p.w&&Math.abs(l.exit.y+36-p.y)<1));
  const points=[l.spawn,...l.anchors,l.exit];for(let i=1;i<points.length;i++)assert(Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y)<=555,`sector ${l.index+1} enlace ${i}`);
 }
});
test('el jugador aterriza, salta y vuelve a aterrizar',()=>{const s=createState();advance(s,20);assert(s.player.grounded);advance(s,1,{jump:true});assert(s.player.vy<0);assert(!s.player.grounded);advance(s,150);assert(s.player.grounded);assert.equal(s.deaths,0)});
test('gancho: alcanza anclaje, limita cuerda y recoge longitud',()=>{const s=createState();assert(hook(s,335,260));const len=s.rope.length;advance(s,60,{right:true,reel:true});assert(s.rope.length<len);assert(Math.hypot(s.player.x-s.rope.x,s.player.y-s.rope.y)<=s.rope.length+1);assert(s.player.x>75);s.rope=null;const x=s.player.x;advance(s,10,{right:true});assert(s.player.x>x)});
test('un anclaje lejano no puede engancharse',()=>{const s=createState();assert.equal(hook(s,740,240),false);assert.equal(s.rope,null)});
test('caer restaura el punto de control y suelta el gancho',()=>{const s=createState();s.checkpoint={x:550,y:500};s.player.y=800;step(s,{},1/120);assert.equal(s.deaths,1);assert.equal(s.player.x,550);assert.equal(s.player.y,500);assert.equal(s.rope,null)});
test('aterrizar en una plataforma guarda el punto de control',()=>{const s=createState();s.player.x=550;s.player.y=495;s.player.vy=200;advance(s,10);assert.equal(s.checkpointIndex,1);respawn(s);assert.equal(s.player.x,560);assert.equal(s.player.y,500)});
test('núcleos se recogen una vez; salida funciona en los 15 sectores',()=>{for(let i=0;i<15;i++){const s=createState(i);Object.assign(s.player,s.level.cores[0]);step(s,{},1/120);assert.equal(s.collected.size,1);Object.assign(s.player,s.level.cores[0],{vx:0,vy:0});step(s,{},1/120);assert.equal(s.collected.size,1);Object.assign(s.player,s.level.exit,{vx:0,vy:0});step(s,{},1/120);assert(s.won,`sector ${i+1}`)}});
test('colisión con dron provoca reintento',()=>{const s=createState(4);const d=dronePosition(s.level.drones[0],1/120);Object.assign(s.player,d);step(s,{},1/120);assert.equal(s.deaths,1);assert.equal(s.won,false)});
// Recorded inputs traverse every level through the real movement and grapple rules.
const routes=JSON.parse(await (await import('node:fs/promises')).readFile(new URL('./fixtures/routes.json',import.meta.url),'utf8'));
for(let i=0;i<15;i++)test(`recorrido jugable del sector ${i+1} sin teletransporte`,()=>{const s=createState(i);for(const {h,reel,dir} of routes[i]){if(h===-2)s.rope=null;else if(h>=0){const a=s.level.anchors[h];assert(hook(s,a.x,a.y))}advance(s,24,{right:dir===1,left:dir===-1,jump:true,reel})}assert(s.won);assert.equal(s.deaths,0)});
