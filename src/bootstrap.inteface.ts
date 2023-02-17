import { Container } from 'inversify';
import { App } from './app';

export interface IBootstrap {
	appContainer: Container;
	app: App;
}
