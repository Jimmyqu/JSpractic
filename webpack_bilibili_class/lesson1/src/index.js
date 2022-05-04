import mii, {add, p} from './add'
import imgS from './static/1648089014(1).png'
import './static/index.css'

console.log(imgS)
const img = document.createElement('img')
img.src = imgS
document.body.appendChild(img)

mii(9,4)
// asy();
p().then(() => {
    console.log('done done')
})
document.body.classList.add('bg')
add(1, 8)