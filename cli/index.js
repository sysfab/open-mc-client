const terrainPng = Texture("/cli/terrain.png")
Blocks.grass = { texture: terrainPng.at(3, 0), solid: true }
Blocks.stone = { texture: terrainPng.at(1, 0), solid: true }
Blocks.dirt = { texture: terrainPng.at(2, 0), solid: true }
Blocks.bedrock = { texture: terrainPng.at(1, 1), solid: true }
Blocks.oak_log = { texture: terrainPng.at(4, 1), solid: true }
Blocks.oak_planks = { texture: terrainPng.at(4, 0), solid: true }
Blocks.sand = { texture: terrainPng.at(2, 1), solid: true }
Blocks.water = { texture: terrainPng.at(13, 12), solid: false }
Blocks.sandstone = { texture: terrainPng.at(0, 12), solid: true }
Blocks.snow_block = { texture: terrainPng.at(2, 4), solid: true }
Blocks.snowy_grass = { texture: terrainPng.at(4, 4), solid: true }
Blocks.coal_ore = { texture: terrainPng.at(2, 2), solid: true }
Blocks.iron_ore = { texture: terrainPng.at(1, 2), solid: true }

Items.oak_log = {
	places(){return Blocks.oak_log()},
	texture: Blocks.oak_log.texture
}
Items.oak_planks = {
	places(){return Blocks.oak_planks()},
	texture: Blocks.oak_planks.texture
}
Items.sandstone = {
	places(){return Blocks.sandstone()},
	texture: Blocks.sandstone.texture
}
Items.stone = {
	places(){return Blocks.stone()},
	texture: Blocks.stone.texture
}


Entities.player = {
	render(c){
		if(!this.textures) return
		const angle = (this.state & 3) == 2 ? sin(t * 4) * this.dx / 5 : sin(t * 12) * this.dx / 10, xs = this.f >= 0 ? 0.9 : -0.9, ys = this.name == 'Dinnerbone' || this.name == 'Grumm' ? -0.9 : 0.9
		if(this.name && this != me){
			c.textAlign = 'center'
			const {width, top, bottom} = c.measure(this.name)
			c.fillStyle = '#000'
			c.globalAlpha = 0.2
			c.fillRect(width * -0.15 - 0.05, this.height + 0.15 - 0.05, width * 0.3 + 0.1, (bottom + top) * 0.3 + 0.1)
			c.globalAlpha = 1
			c.fillStyle = '#fff'
			c.fillText(this.name, 0, this.height + 0.15 + bottom * 0.3, 0.3)
		}
		if(ys < 0)c.translate(0, this.height)
		c.scale(xs, ys)
		if(this.state & 2){
			c.translate(0.2, 1.2)
			c.rotate(angle - .5)
			c.image(this.textures.arm2, -0.125, -0.625, 0.25, 0.75)
			c.rotate(-angle + .5)
			c.translate(-0.3,-0.45)
			c.rotate(-angle)
			c.image(this.textures.leg2, -0.125, -0.75, 0.25, 0.75)
			c.rotate(angle - .5)
			c.image(this.textures.body, -0.125, -0.125, 0.25, 0.75)
			c.rotate(0.5)
			c.rotate(angle)
			c.image(this.textures.leg1, -0.125, -0.75, 0.25, 0.75)
			c.rotate(-angle)
			c.translate(0.3, 0.45)
			c.rotate(-angle - .5)
			c.image(this.textures.arm1, -0.125, -0.625, 0.25, 0.75)
			c.rotate(angle + .5)
		}else{
			c.translate(0, 1.375)
			c.rotate(angle)
			c.image(this.textures.arm2, -0.125, -0.625, 0.25, 0.75)
			c.rotate(-angle)
			c.translate(0,-0.625)
			c.rotate(-angle)
			c.image(this.textures.leg2, -0.125, -0.75, 0.25, 0.75)
			c.rotate(angle)
			c.image(this.textures.body, -0.125, 0, 0.25, 0.75)
			c.rotate(angle)
			c.image(this.textures.leg1, -0.125, -0.75, 0.25, 0.75)
			c.rotate(-angle)
			c.translate(0, 0.625)
			c.rotate(-angle)
			c.image(this.textures.arm1, -0.125, -0.625, 0.25, 0.75)
			c.rotate(angle)
			c.translate(0,0.1)
		}
		c.rotate(PI/2-abs(this.f))
		c.image(this.textures.head, -0.25, 0, 0.5, 0.5)
	},
	appeared(){
		const can = Can(28, 12)
		const skinUnpacked = new ImageData(28, 12)
		for(let i = 0; i < 336; i++){
			skinUnpacked.data[i << 2] = this.skin[i * 3]
			skinUnpacked.data[(i << 2) + 1] = this.skin[i * 3 + 1]
			skinUnpacked.data[(i << 2) + 2] = this.skin[i * 3 + 2]
			skinUnpacked.data[(i << 2) + 3] = 255
		}
		can.putImageData(skinUnpacked, 0, 0)
		this.textures = {
			head: can.texture(20, 4, 8, 8),
			body: can.texture(0, 0, 4, 12),
			arm1: can.texture(4, 0, 4, 12),
			arm2: can.texture(8, 0, 4, 12),
			leg1: can.texture(12, 0, 4, 12),
			leg2: can.texture(16, 0, 4, 12)
		}
		this.inv[0] = Items.oak_log(1)
		this.inv[1] = Items.stone(1)
		this.inv[2] = Items.sandstone(1)
	},
	width: 0.3,
	get height(){return this.state & 2 ? 1.5 : 1.8},
	get head(){return this.state & 2 ? 1.4 : 1.6},
	drawInterface(id, c, mx, my){
		// x=0, y=0 => left middle
		// x=176 => right
		if(id == 0){
			c.image(meInterface, 0, 0)
			c.translate(50,5)
			c.scale(32,32)
			const f = this.f
			this.f = atan2(mx - 50, -my - this.head * 32 - 5)
			this.render(c)
			this.f = f
			c.scale(.03125,.03125)
			c.translate(-50,-5)
		}
	}
}

const skyPng = Texture('/cli/sky.png')
const stars = Texture('/cli/stars.png').pattern()
const sun = skyPng.crop(128, 64, 32, 32), moons = [
	skyPng.crop(128, 0, 32, 32),
	skyPng.crop(160, 0, 32, 32),
	skyPng.crop(192, 0, 32, 32),
	skyPng.crop(224, 0, 32, 32),
	skyPng.crop(128, 32, 32, 32),
	skyPng.crop(160, 32, 32, 32),
	skyPng.crop(192, 32, 32, 32),
	skyPng.crop(224, 32, 32, 32)
], cloudMap = skyPng.crop(128, 127, 128, 1).pattern('repeat')
uiLayer(-100, (c, w, h) => {
	if(world != 'overworld')return
	const reach = pointer.effectiveReach()
	const time = ticks % 24000
	const light = time < 1800 ? time / 1800 : time < 13800 ? 1 : time < 15600 ? (15600 - time) / 1800 : 0
	let orangeness = 0
	if(time < 1800)orangeness = 1 - abs(time - 900)/900
	else if(time >= 13800 && time < 15600)orangeness = 1 - abs(time - 14700)/900
	const wspan = w + 64 + reach/2
	let gradient = c.createLinearGradient(0, 0, 0, h)
	gradient.addColorStop(0.3, '#040609')
	gradient.addColorStop(0.7, '#0a0c14')
	c.fillStyle = gradient
	c.fillRect(0, 0, w, h)
	c.rect(0, 0, w, h)
	const xo = wspan * ((time + 12600) % 24000 / 8400 - .5) - 20 - reach/4 - pointer.x*cam.z/16
	const yo = h/2 - 70 - h/4 * sin(((time + 12600) % 24000 / 8400 - .5) * PI) + pointer.y*cam.z/16
	c.translate(xo, yo)
	c.fillStyle = stars
	c.fill()
	c.translate(-xo, -yo)
	gradient = c.createLinearGradient(0, 0, 0, h)
	gradient.addColorStop(0.3, '#78a7ff')
	gradient.addColorStop(0.7, '#c3d2ff')
	c.globalAlpha = light
	c.fillStyle = gradient
	c.fillRect(0, 0, w, h)
	gradient = c.createLinearGradient(0, 0, 0, h)
	gradient.addColorStop(0.3, 'transparent')
	gradient.addColorStop(0.7, '#c5563b')
	c.globalAlpha = orangeness
	c.fillStyle = gradient
	c.fillRect(0, 0, w, h)
	c.globalAlpha = 1
	c.globalCompositeOperation = 'lighter'
	if(time < 15600){
		const progress = time / 15600
		c.image(sun, wspan * progress - 64 - reach/4 - pointer.x*cam.z/16, h/2 - 96 - h/4 * sin(progress * PI) + pointer.y*cam.z/16, 64, 64)
	}else{
		const progress = (time - 15600) / 8400
		c.image(moons[ticks / 24000 & 7], wspan * progress - 64 - reach/4 - pointer.x*cam.z/16, h/2 - 96 - h/4 * sin(progress * PI) + pointer.y*cam.z/16, 64, 64)
	}
	c.globalCompositeOperation = 'source-over'
	c.globalAlpha = 1
})

const cloudLayers = [
	{y: 64, h: 4, s: 1, o: 'soft-light', a: 1},
	{y: 128, h: 6, s: -0.5, o: 'soft-light', a: 1},
	{y: 256, h: 2, s: 4, o: 'hard-light', a: 0.5},
	{y: 512, h: 7, s: -2, o: 'hard-light', a: 0.4},
	{y: 1024, h: 3, s: 0.5, o: 'soft-light', a: 0.5},
	{y: 2048, h: 1, s: -4, o: 'soft-light', a: 0.6},
	{y: 4096, h: 5, s: 2, o: 'hard-light', a: 0.5},
	{y: 8192, h: 8, s: -1, o: 'hard-light', a: 0.7},
	{y: 69420, h: 21, s: 8, o: 'soft-light', a: 1},
]

renderLayer(150, c => {
	if(world != 'overworld')return
	for(const {y, h, s, o, a} of cloudLayers){
		c.globalCompositeOperation = o
		c.globalAlpha = a
		c.beginPath()
		c.rect(-W2, (y - cam.y) * 0.7, W2 * 2, h)
		const x = (t * s - cam.x) % (384 * h)
		c.translate(x, 0)
		c.scale(h * 3, h * 3)
		c.fillStyle = cloudMap
		c.fill()
		c.scale(1 / (h * 3), 1 / (h * 3))
		c.translate(-x, 0)
	}
	c.globalAlpha = 1
	c.globalCompositeOperation = 'source-over'
})

const hotbar = Texture('/cli/hotbar.png')
const slot = Texture('/cli/slot.png')
const inventory = Texture('/cli/inv.png')
const meInterface = Texture('/cli/meint.png')

uiLayer(1000, (c, w, h) => {
	let hotBarLeft = w / 2 - hotbar.w/2
	const hotBarBottom = 5
	c.image(hotbar, hotBarLeft, hotBarBottom, hotbar.w, hotbar.h)
	c.image(slot, hotBarLeft - 1 + me.selected * 20, hotBarBottom - 1, slot.w, slot.h)
	if(!me || !me.inv)return
	for(let i = 0; i < 9; i++){
		if(!me.inv[i])continue
		c.image(me.inv[i].texture, hotBarLeft + 3, hotBarBottom + 3, 16, 16)
		hotBarLeft += 20
	}
	if(!invInterface) return
	c.fillStyle = '#000'
	c.globalAlpha = 0.2
	c.fillRect(0, 0, w, h)
	c.globalAlpha = 1
	c.translate(w / 2 - 88, h / 2)
	c.image(inventory, 0, -inventory.h)
	for(let i = 0; i < 9; i++){

	}
	invInterface.drawInterface(interfaceId, c, mx - w / 2 + 88, my - h / 2)
	c.translate(w / -2 + 88, h / -2)
})

let invInterface = null, interfaceId = 0

onpause(() => {
	if(!paused && invInterface){
		const buf = new DataWriter()
		buf.byte(15)
		send(buf)
		invInterface = null
	}
})

function openEntity(e, id = 0){
	pause(true)
	const buf = new DataWriter()
	buf.byte(13)
	buf.int(e._id)
	buf.short((e._id / 4294967296) | 0)
	buf.byte(id)
	send(buf)
}
function closeInterface(){ pause(false) }

onpacket(13, buf => {
	const e = entities.get(buf.int() + buf.short() * 4294967296)
	if(!e)return
	invInterface = e
	interfaceId = buf.byte()
})

button(KEY_E, () => {
	if(paused)return closeInterface()
	openEntity(me)
})



function renderItem(c, item, showCount = true){
	if(!texture) return
	c.image(item.texture, -0.5, 0, 1, 1)
	if(showCount){
		c.fillText(item.count + '', )
	}
}