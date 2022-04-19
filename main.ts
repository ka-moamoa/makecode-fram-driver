// Add your code here
enum OPCODES {
    OPCODE_READ = 3,
    OPCODE_WRITE = 2,
    OPCODE_RDID = 159,
    OPCODE_WREN = 6
}
let intermittent
//let base
let timer = 100
//let weight = 100
//let jit = 0 //P2 analog in
let generation: number
let gencopy: number
let label: number
let customMKArg0: number
let customMKArg1: number
let customMKArg2: number
let customMKArg3: number
let customMKArg4: number
let customMKArg5: number
let customMKArg6: number
let customMKArg7: number
let customMKArg8: number
let customMKArg9: number
let customMKArg10: number
let customMKArg11: number
let customMKArg12: number
let customMKArg13: number
let customMKArg14: number
let customMKArg15: number
let customMKArg16: number
let customMKArg17: number
let customMKArg18: number
let customMKArg19: number
let customMKArg20: number
let customMKArg21: number
let customMKArg22: number
let customMKArg23: number
let customMKArg24: number
let customMKArg25: number
let customMKArg26: number
let customMKArg27: number
let customMKArg28: number
let customMKArg29: number

//% advanced=true
namespace fram {
    //% blockId=fram_begin block="fram|begin"
    export function begin() {
        pins.digitalWritePin(DigitalPin.P9, 1)
        pins.spiPins(DigitalPin.P15, DigitalPin.P14, DigitalPin.P13)
        pins.spiFormat(8, 0)
        pins.spiFrequency(20000000)
        fram.getDeviceID()
        //fram.writeEnable()
        

    }
    //% blockId=fram_init block="fram|init"
    export function init() {
        //fram.begin()
        fram.write8(1000, 0)
        generation = fram.read8(0)
        fram.write_number(1000, 0, 0)
        fram.read_number(1000, 0)
        fram.writeBoolean(1000,false,0)
        fram.readBoolean(1000,0)
        fram.writeArray(1000,[],0)
        fram.readArray(1000,1,0)
        fram.writeString(1000,"",0)
        fram.readString(1000,0)
        intermittent = true // comment this out to turn off transformations
        //base = true // checkpoint every block
        timer = 100 // checkpoint on timer in ms
        //weight = 100 // checkpoint based on weight of loop
        //jit = 0 // checkpoint based on capacitor
        label = 0
        customMKArg0 = 0
        customMKArg1 = 0
        customMKArg2 = 0
        customMKArg3 = 0
        customMKArg4 = 0
        customMKArg5 = 0
        customMKArg6 = 0
        customMKArg7 = 0
        customMKArg8 = 0
        customMKArg9 = 0
        customMKArg10 = 0
        customMKArg11 = 0
        customMKArg12 = 0
        customMKArg13 = 0
        customMKArg14 = 0
        customMKArg15 = 0
        customMKArg16 = 0
        customMKArg17 = 0
        customMKArg18 = 0
        customMKArg19 = 0
        customMKArg20 = 0
        customMKArg21 = 0
        customMKArg22 = 0
        customMKArg23 = 0
        customMKArg24 = 0
        customMKArg25 = 0
        customMKArg26 = 0
        customMKArg27 = 0
        customMKArg28 = 0
        customMKArg29 = 0
        gencopy = 5

    }

    /**
     * Write one byte to the address.
     * @param addr to send over serial
     * @param val to send over serial
     */
    //% weight=90
    //% help=fram/write8 blockGap=8
    //% blockId=fram_write8 block="fram|write8 %addr %val"
    export function write8(addr: number, val: number) {
        pins.i2cWriteNumber(addr, val, NumberFormat.Int8LE, false)
    }

    //% blockId=fram_read8 block="fram|read8 %addr"
    export function read8(addr: number) {
        return pins.i2cReadNumber(addr,NumberFormat.Int8LE)
    }

    export function clear() {
        
        for (let i = 0; i < 8000; i++) {
            pins.i2cWriteNumber(i, 0, NumberFormat.Int8LE,true)
        }
        pins.i2cWriteNumber(8000, 0, NumberFormat.Int8LE, false)
    }

    export function writeBoolean(addr:number, val:boolean, addrlength:number){
        if (generation == 1) {
            addr+=addrlength
        } 
        
        if(val){
            pins.i2cWriteNumber(1, 0, NumberFormat.Int8LE)
        } else {
            pins.i2cWriteNumber(0, 0, NumberFormat.Int8LE)
        }
        
    }

    export function readBoolean(addr:number, addrlength:number){
        
        if (generation != 1) {
            addr+= addrlength
        } 
        

        let p1 = pins.i2cReadNumber(addr, NumberFormat.Int8LE, false)
        
        if(p1 == 1){
            return true
        } else if(p1 == 0){
            return false
        } else {
            basic.showIcon(IconNames.Sad)
            while(1);
            return false
        }
    }

    export function writeArray(addr:number, val:any[], addrlength:number){
        if(addrlength <= 0){
            return
        }
        if(val.length > 25){
            basic.showIcon(IconNames.Angry)
            while(1);
            return
        }
        
        if (generation == 1) {
            addr+=addrlength
        } 
        
        
        
        pins.i2cWriteNumber(addr, val.length, NumberFormat.Int8LE, false)
        for(let i = 0; i < val.length; i++){
            pins.i2cWriteNumber(addr+(i*4), val[i], NumberFormat.Int32LE, false)
        }

    }

    export function readArray(addr:number, arrtype:number, addrlength:number){
        if (addrlength <= 0) {
            return []
        }
        
        if (generation != 1) {
            addr+=addrlength
        } 
        

        let val:number[]

        let val_len = pins.i2cReadNumber(addr, NumberFormat.Int8LE, false)
        for (let i = 0; i < val_len; i++) {
            val.push(pins.i2cReadNumber(addr+(i*4), NumberFormat.Int32LE, false))
        }

        

        return val
    }

    export function writeString(addr:number, str:String, addrlength:number){
        if(addrlength <= 0){
            return
        }
        if(str.length >= 99){
            basic.showIcon(IconNames.Meh)
            while(1);
            return
        }
        

        if (generation == 1) {
            addr+=addrlength
        } 
       
        
        pins.i2cWriteNumber(addr, str.length, NumberFormat.Int8LE)
        for(let i = 0; i < str.length; i++){ 
            pins.i2cWriteNumber(addr + i, str.charCodeAt(i), NumberFormat.Int8LE)
        }
        
    }

    export function readString(addr:number, addrlength:number){
        if(addrlength <= 0){
            return
        }
        
        if (generation != 1) {
            addr+=addrlength
        } 
        
        let read_str = ""
        let str_len = pins.i2cReadNumber(addr, NumberFormat.Int8LE, false)
        for(let i = 0; i < str_len; i++){
            read_str = read_str.concat(String.fromCharCode(pins.i2cReadNumber(0, NumberFormat.Int8LE, false)))
        }

    }



    //% blockId=fram_write_number block="fram|write number %addr %val"
    export function write_number(addr: number, val: number, addrlength: number) {
        //serial.writeLine("Generation = "+generation)
        if (generation == 1) {
            addr+=addrlength
        } 
        
        pins.i2cWriteNumber(addr, val, NumberFormat.Int32LE)
    }

    //% blockId=fram_read_number block="fram|read number %addr"
    export function read_number(addr: number, addrlength: number) {
        //serial.writeLine("Generation: "+generation)
        
        if (generation != 1) {
            addr+=addrlength
        } 
        

        
        return pins.i2cReadNumber(addr, NumberFormat.Int32LE)
    }



    //% blockId=fram_getdeviceid block="fram|get device ID"
    export function getDeviceID() {
        let whoami = 0
        let wh0 = 0
        let wh1 = 0
        let wh2 = 0
        let wh3 = 0
        pins.digitalWritePin(DigitalPin.P9, 0)
        whoami = pins.spiWrite(OPCODES.OPCODE_RDID)
        wh0 = pins.spiWrite(255)
        wh1 = pins.spiWrite(255)
        wh2 = pins.spiWrite(255)
        wh3 = pins.spiWrite(255)
        pins.digitalWritePin(DigitalPin.P9, 1)
        //serial.writeString("WHOAMI: " + ("" + whoami) + " wh0:" + ("" + wh0) + " wh1:" + ("" + wh1) + " wh2:" + ("" + wh2) + " wh3:" + ("" + wh3) + "\n")
        if (wh1 == 127) {
            //serial.writeString("FRAM Connected\n")
        } else {
            //serial.writeString("ERR: FRAM not Connected\n")
        }
    }
    //% blockId=fram_writeenable block="fram|write enable"
    export function writeEnable() {
        pins.digitalWritePin(DigitalPin.P9, 0)
        let wh3 = pins.spiWrite(OPCODES.OPCODE_WREN)
        pins.digitalWritePin(DigitalPin.P9, 1)
        //serial.writeLine("FRAM Writes Enabled")
    }

}
