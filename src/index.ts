//@ts-ignore
import Demo from "./Demo.vue"
import { add } from "./utils"
export { add }
export { Demo }
export function pkg() {
    console.log(111111111)
    add(1, 2)
    console.log(Demo)
}