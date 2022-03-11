/*
Riven
load dependency
"newland": "file:../pxt-newland"
*/

//% color="#5c7cfa" weight=10 icon="\uf108"
//% groups='["Basic"]'
namespace ME66 {
  //type起个新类型

  type Evtxye = (x: string, y: string, e: string) => void

  let btnEvt: Evtxye = null

  export enum SerialPorts {
    PORT1 = 0,
    PORT2 = 1,
    PORT3 = 2,
    PORT4 = 3,
  }

  export enum VolumeNum {
    //% block=Volume5
    Volume5 = 5,
    //% block=Volume0
    Volume0 = 0,
    //% block=Volume1
    Volume1 = 1,
    //% block=Volume2
    Volume2 = 2,
    //% block=Volume3
    Volume3 = 3,
    //% block=Volume4
    Volume4 = 4,
  }

  export enum OnOffDirection {
    //% block=On
    On = 1,
    //% block=Off
    Off = 0,
  }

  export enum LcdDirection {
    //% block=Front
    Front = 0,
    //% block=Back
    Back = 2,
  }



  serial.onDataReceived('\n', function () {

    let a = serial.readUntil('\n')
    if (a.indexOf("<STX>") != -1) {

    } else {
      // let b = '{"SKU":1002,"Name_CN":"瓜子","Name_PY":"guazi","Price":10.00}';
      let obj = JSON.parse(a);
      //basic.showNumber(1)
      //   basic.showString(obj.Price)
      if (btnEvt) {
             btnEvt(obj.SKU, obj.Name_PY, obj.Price) // btna btnb
      }
      let cmd = 42;
      control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 0x8900 + cmd)
    }

  })

  function asyncWrite(msg: string, evt: number): void {
    serial.writeLine(msg)
    //control.waitForEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 0x8900 + evt)

  }

  /**
   * init serial port
   * @param tx Tx pin; eg: SerialPin.P1
   * @param rx Rx pin; eg: SerialPin.P2
   */
  //% blockId=newland_init block="Newland init|Tx pin %tx|Rx pin %rx"
  //% group="Basic" weight=100
  export function newland_init(tx: SerialPin, rx: SerialPin): void {
    serial.redirect(tx, rx, BaudRate.BaudRate115200)
    serial.readString()
    serial.setRxBufferSize(128)
    serial.writeString('\n\n')
    basic.pause(300)
  }

  //% blockId=newland_volume_control block="Newland  Volume Dir%dir"
  //% group="Basic" weight=98
  export function newland_volume_control(dir: VolumeNum): void {
    if (dir == 0) {
      serial.writeLine('<STX><0015><SET><01><00><VOLUME=0><ETX><56>')
    } else if (dir == 1) {
      serial.writeLine('<STX><0015><SET><01><00><VOLUME=1><ETX><57>')
    } else if (dir == 2) {
      serial.writeLine('<STX><0015><SET><01><00><VOLUME=2><ETX><54>')
    } else if (dir == 3) {
      serial.writeLine('<STX><0015><SET><01><00><VOLUME=3><ETX><55>')
    } else if (dir == 4) {
      serial.writeLine('<STX><0015><SET><01><00><VOLUME=4><ETX><52>')
    } else if (dir == 5) {
      serial.writeLine('<STX><0015><SET><01><00><VOLUME=5><ETX><53>')
    }
    basic.pause(100)
  }

  //% blockId=newland_volume_onOff block="Newland Volume onOff%dir"
  //% group="Basic" weight=98
  export function newland_volume_onOff(dir: OnOffDirection): void {
    if (dir == 0) {
      serial.writeLine('<STX><0021><SET><01><00><PROMPT=0003OFF><ETX><21>')
    } else if (dir == 1) {
      serial.writeLine('<STX><0020><SET><01><00><PROMPT=0002ON><ETX><6F>')
    }
    basic.pause(100)
  }

  //% blockId=newland_volume_set block="Newland volume Set"
  //% group="Basic" weight=88
  export function newland_volume_set(): void {
    //OFF
    serial.writeLine('<STX><0016><SET><01><00><RESET=OFF><ETX><77>')
    basic.pause(100)
    //ON
    serial.writeLine('<STX><0015><SET><01><00><RESET=ON><ETX><3A>')
    basic.pause(100)
  }

  //% blockId=newland_scan_items block="on Button"
  //% weight=96
  //% group="Basic" draggableParameters=reporter
  export function newland_scan_items(
      handler: (SKU: string, Name: string, Price: string) => void
  ): void {
    btnEvt = handler
  }

}
