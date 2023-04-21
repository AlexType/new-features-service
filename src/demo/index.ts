import { NewFeaturesService } from "../lib";
import { NewFeaturesProvider } from "../lib/providers/new-features-provider";

enum Features {
  BotsPage = 1 << 0,
  CommentPin = 1 << 1,
  MessagePin = 1 << 2,
  EventsMultiPin = 1 << 3
}

class Provider extends NewFeaturesProvider {
  public get newFeatures(): Promise<number> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(5);
      }, 300)
    });
  }
  public markNewFeatureAsUsed(feature: number): Promise<void> {
    return new Promise(() => { console.log('MARk') });
  }
  protected stopListenPushes(): void {
    console.log('STOP');
  }
  protected startListenPushes(refreshFn: () => any): void {
    refreshFn();
    console.log('START');
  }
  constructor() {
    super();
  }
}

(async () => {
  const provider = new Provider();
  const newFeaturesService = new NewFeaturesService(provider, [Features.BotsPage | Features.CommentPin | Features.EventsMultiPin]);
  console.log(await newFeaturesService.showAvailableFeatures(Features.BotsPage));
  console.log(newFeaturesService.shownNewFeatures);
})()

