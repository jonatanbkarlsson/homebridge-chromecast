import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';
import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import Accessory from './accessory';
import Bonjour from 'bonjour-service';

export default class Platform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;
  public readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    private readonly config: PlatformConfig,
    private readonly api: API) {
    this.api.on('didFinishLaunching', () => this.discoverDevices());
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);
    this.accessories.push(accessory);
  }

  discoverDevices() {
    const bonjour = new Bonjour();

    bonjour.find({ type: 'googlecast' }, service => {
      this.log.debug(`found chromecast named "${service.name}" at ${service.addresses?.[0]} with id ${service.txt.id}`);
      this.log.debug(JSON.stringify(service.txt));

      const uuid = this.api.hap.uuid.generate(service.txt.id);
      const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

      if (existingAccessory) {
        existingAccessory.context.device = service;

        this.api.updatePlatformAccessories([existingAccessory]);

        new Accessory(this, existingAccessory);

        //this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [existingAccessory]);

      } else {
        const accessory = new this.api.platformAccessory(service.txt.md, uuid);

        accessory.context.device = service;
        accessory.category = this.api.hap.Categories.SPEAKER;

        new Accessory(this, accessory);

        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      }
    })
  }
}
