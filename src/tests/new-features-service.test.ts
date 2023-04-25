import { NewFeaturesService } from '../lib';
import { NewFeaturesProvider } from '../lib/provider/new-features-provider';

enum Features {
  BotsPage = 1 << 0,
  CommentPin = 1 << 1,
  MessagePin = 1 << 2,
  EventsMultiPin = 1 << 3
}

const callback = jest.fn();
const providerSpy = {
  getNewFeatures: jest.fn(),
  markNewFeatureAsUsed: jest.fn(),
  stopListenPushes: jest.fn(),
  startListenPushes: jest.fn()
};

class Provider implements NewFeaturesProvider {
  public getNewFeatures(): Promise<number> {
    providerSpy.getNewFeatures();
    return new Promise(resolve => { resolve(Features.BotsPage | Features.CommentPin | Features.EventsMultiPin); });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public markNewFeatureAsUsed(feature: number): Promise<void> {
    providerSpy.markNewFeatureAsUsed();
    return new Promise(() => { return; });
  }
  public stopListenPushes(): void {
    providerSpy.stopListenPushes();
  }
  public startListenPushes(refreshFn: () => void): void {
    refreshFn();
    providerSpy.startListenPushes();
  }
}

let provider: Provider;
let service: NewFeaturesService;

beforeEach(() => {
  provider = new Provider();
  service = new NewFeaturesService(provider, [Features.BotsPage | Features.CommentPin | Features.EventsMultiPin]);
});

it('NewFeaturesService must be created', () => {
  expect(service).toBeTruthy();
});

it('shownNewFeatures to be 0', () => {
  expect(service.shownNewFeatures).toBe(0);
});

it('availableFeatures must be Features.CommentPin', async () => {
  providerSpy.getNewFeatures.mockReset();
  expect(providerSpy.getNewFeatures.mock.calls).toHaveLength(0);
  const res = await service.availableFeatures(Features.CommentPin);
  expect(res).toBe(Features.CommentPin);
  expect(providerSpy.getNewFeatures.mock.calls).toHaveLength(1);
});

it('availableFeatures must be empty', async () => {
  providerSpy.getNewFeatures.mockReset();
  expect(providerSpy.getNewFeatures.mock.calls).toHaveLength(0);
  const res = await service.availableFeatures(Features.MessagePin);
  expect(res).toBe(0);
  expect(providerSpy.getNewFeatures.mock.calls).toHaveLength(1);
});

it('showAvailableFeatures must be successful and shownNewFeatures must be Features.CommentPin', async () => {
  providerSpy.getNewFeatures.mockReset();
  expect(providerSpy.getNewFeatures.mock.calls).toHaveLength(0);
  const res = await service.showAvailableFeatures(Features.CommentPin);
  expect(res).toBe(Features.CommentPin);
  expect(providerSpy.getNewFeatures.mock.calls).toHaveLength(1);
  expect(service.shownNewFeatures).toBe(Features.CommentPin);
});

it('showAvailableFeatures must be unsuccessful and shownNewFeatures must be 0', async () => {
  const res = await service.showAvailableFeatures(Features.MessagePin);
  expect(res).toBe(0);
  expect(service.shownNewFeatures).toBe(0);
});

it('isNewFeature must be unsuccessful', async () => {
  const res = await service.isNewFeature(Features.MessagePin);
  expect(res).toBeFalsy();
});

it('isNewFeature must be successful', async () => {
  const res = await service.isNewFeature(Features.CommentPin);
  expect(res).toBeTruthy();
});

it('markNewFeatureAsUsed must be unsuccessful', async () => {
  providerSpy.markNewFeatureAsUsed.mockClear();
  const res = await service.markNewFeatureAsUsed(Features.MessagePin);
  expect(res).toBeFalsy();
  expect(providerSpy.markNewFeatureAsUsed.mock.calls).toHaveLength(0);
});

it('markNewFeatureAsUsed must be successful', async () => {
  providerSpy.markNewFeatureAsUsed.mockClear();
  const res = await service.markNewFeatureAsUsed(Features.CommentPin);
  expect(res).toBeTruthy();
  expect(providerSpy.markNewFeatureAsUsed.mock.calls).toHaveLength(1);
});

it('subscription should work and call the callback', () => {
  service.subscribeOnChangeState(callback);
  expect(providerSpy.startListenPushes.mock.calls).toHaveLength(1);
});

it('unsubscription should work and call the callback', () => {
  service.subscribeOnChangeState(callback);
  service.unsubscribeFromChangeState(callback);
  expect(providerSpy.stopListenPushes.mock.calls).toHaveLength(1);
});

it('hide must be successful', async () => {
  const res = await service.showAvailableFeatures(Features.CommentPin);
  expect(res).toBe(Features.CommentPin);
  expect(service.shownNewFeatures).toBe(Features.CommentPin);
  service.hide(Features.CommentPin);
  expect(service.shownNewFeatures).toBe(0);
});

it('showAvailableFeatures must be successful Features.CommentPin | Features.EventsMultiPin', async () => {
  await service.showAvailableFeatures(Features.CommentPin);
  await service.showAvailableFeatures(Features.EventsMultiPin);
  await service.showAvailableFeatures(Features.MessagePin);
  expect(service.shownNewFeatures).toBe(Features.CommentPin | Features.EventsMultiPin);
});
