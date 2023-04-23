import { Service, PlatformAccessory } from 'homebridge';
import Platform from './platform';

export default class Accessory {
  private service: Service;

  constructor(
    private readonly platform: Platform,
    private readonly accessory: PlatformAccessory) {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Google Inc.')
      .setCharacteristic(this.platform.Characteristic.Model, accessory.context.device.txt.md)
      .setCharacteristic(this.platform.Characteristic.SerialNumber, (accessory.context.device.txt.id).substring(0, 12))
      .setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.txt.fn)
      .setCharacteristic(this.platform.Characteristic.ConfiguredName, accessory.context.device.txt.fn)
      .setCharacteristic(this.platform.Characteristic.ActiveIdentifier, 1)
      .setCharacteristic(this.platform.Characteristic.SleepDiscoveryMode, this.platform.Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE);

    this.service = this.accessory.getService(this.platform.Service.SmartSpeaker) || this.accessory.addService(this.platform.Service.SmartSpeaker);

    // NOTE: Handle active.
    this.service.getCharacteristic(this.platform.Characteristic.Active)
      .onSet(value => {
        this.platform.log.debug('Active', value);
        this.service.updateCharacteristic(this.platform.Characteristic.Active, 1);
      })

    // NOTE: Handle input source.
    this.service.getCharacteristic(this.platform.Characteristic.ActiveIdentifier)
      .onSet(value => {
        this.platform.log.debug('Active identifier', value);
      })

    // NOTE: Handle remote control.
    this.service.getCharacteristic(this.platform.Characteristic.RemoteKey)
      .onSet(value => {
        this.platform.log.debug('Remote key', value);
      })
  }
}