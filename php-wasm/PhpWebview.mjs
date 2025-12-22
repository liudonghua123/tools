import { PhpBase } from './PhpBase.mjs';
import PhpBinary from './php-webview.mjs';

export class PhpWebview extends PhpBase
{
	constructor(args = {})
	{
		super(PhpBinary, args);
	}
}
