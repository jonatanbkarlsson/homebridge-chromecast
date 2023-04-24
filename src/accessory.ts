import { Service, PlatformAccessory } from 'homebridge';
import Platform from './platform';

export default class Accessory {
  private service: Service;

  constructor(
    private readonly platform: Platform,
    private readonly accessory: PlatformAccessory) {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Google Inc.')
      .setCharacteristic(this.platform.Characteristic.Model, this.accessory.context.device.txt.md)
      .setCharacteristic(this.platform.Characteristic.SerialNumber, (this.accessory.context.device.txt.id).substring(0, 12))
      .setCharacteristic(this.platform.Characteristic.Name, this.accessory.context.device.txt.fn);

    this.service = this.accessory.getService(this.platform.Service.Switch) || this.accessory.addService(this.platform.Service.Switch);

    // NOTE: Handle on.
    this.service.getCharacteristic(this.platform.Characteristic.On)
      .onGet(() => 1)
      .onSet(value => {
        this.platform.log.debug('On', value);
      })
  }
}