import { PhpBase } from './PhpBase.mjs';
import PhpBinary from './php-worker.mjs';

export class PhpWorker extends PhpBase
{
	constructor(args = {})
	{
		super(PhpBinary, args);
	}
}
