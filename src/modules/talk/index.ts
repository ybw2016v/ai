import autobind from 'autobind-decorator';
import { HandlerResult } from '@/ai';
import Module from '@/module';
import Message from '@/message';
import serifs, { getSerif } from '@/serifs';
import getDate from '@/utils/get-date';

export default class extends Module {
	public readonly name = 'talk';

	@autobind
	public install() {
		return {
			mentionHook: this.mentionHook,
		};
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (!msg.text) return false;

		return (
			this.greet(msg) ||
			this.erait(msg) ||
			this.omedeto(msg) ||
			this.nadenade(msg) ||
			this.kawaii(msg) ||
			this.suki(msg) ||
			this.hug(msg) ||
			this.humu(msg) ||
			this.batou(msg) ||
			this.itai(msg) ||
			this.ote(msg) ||
			this.ponkotu(msg) ||
			this.rmrf(msg) ||
			this.shutdown(msg)
		);
	}

	@autobind
	private greet(msg: Message): boolean {
		if (msg.text == null) return false;

		const incLove = () => {
			//#region 1日に1回だけ親愛度を上げる
			const today = getDate();

			const data = msg.friend.getPerModulesData(this);

			if (data.lastGreetedAt == today) return;

			data.lastGreetedAt = today;
			msg.friend.setPerModulesData(this, data);

			msg.friend.incLove();
			//#endregion
		};

		// 末尾のエクスクラメーションマーク
		const tension = (msg.text.match(/[！!]{2,}/g) || [''])
			.sort((a, b) => a.length < b.length ? 1 : -1)[0]
			.substr(1);

		if (msg.includes(['你好', '您好', 'hi', 'hello'])) {
			msg.reply(serifs.core.hello(msg.friend.name));
			incLove();
			return true;
		}

		if (msg.includes(['晚好', '晚上好'])) {
			msg.reply(serifs.core.helloNight(msg.friend.name));
			incLove();
			return true;
		}

		if (msg.includes(['早安', '早上好'])) {
			msg.reply(serifs.core.goodMorning(tension, msg.friend.name));
			incLove();
			return true;
		}

		if (msg.includes(['晚安'])) {
			msg.reply(serifs.core.goodNight(msg.friend.name));
			incLove();
			return true;
		}

		if (msg.includes(['回头见', '再见', '走了', '先走'])) {
			msg.reply(
				msg.friend.love >= 7
					? serifs.core.itterassyai.love(msg.friend.name)
					: serifs.core.itterassyai.normal(msg.friend.name));
			incLove();
			return true;
		}

		if (msg.includes(['回来了'])) {
			msg.reply(
				msg.friend.love >= 15 ? serifs.core.okaeri.love2(msg.friend.name) :
				msg.friend.love >= 7 ? getSerif(serifs.core.okaeri.love(msg.friend.name)) :
				serifs.core.okaeri.normal(msg.friend.name));
			incLove();
			return true;
		}

		return false;
	}

	@autobind
	private erait(msg: Message): boolean {
		/*
		const match = msg.extractedText.match(/(.+?)た(から|ので)(褒|ほ)めて/);
		if (match) {
			msg.reply(getSerif(serifs.core.erait.specify(match[1], msg.friend.name)));
			return true;
		}

		const match2 = msg.extractedText.match(/(.+?)る(から|ので)(褒|ほ)めて/);
		if (match2) {
			msg.reply(getSerif(serifs.core.erait.specify(match2[1], msg.friend.name)));
			return true;
		}

		const match3 = msg.extractedText.match(/(.+?)だから(褒|ほ)めて/);
		if (match3) {
			msg.reply(getSerif(serifs.core.erait.specify(match3[1], msg.friend.name)));
			return true;
		}

		 */

		if (!msg.includes(['夸奖我', '赞扬我'])) return false;

		msg.reply(getSerif(serifs.core.erait.general(msg.friend.name)));

		return true;
	}

	@autobind
	private omedeto(msg: Message): boolean {
		if (!msg.includes(['祝贺', '恭喜'])) return false;

		msg.reply(serifs.core.omedeto(msg.friend.name));

		return true;
	}

	@autobind
	private nadenade(msg: Message): boolean {
		if (!msg.includes(['摸'])) return false;

		// 仅限私聊
		if (!msg.isDm) return true;

		//#region 每天只提升一次好感度等级（只有在她们不讨厌发出者的情况下）。
		if (msg.friend.love >= 0) {
			const today = getDate();

			const data = msg.friend.getPerModulesData(this);

			if (data.lastNadenadeAt != today) {
				data.lastNadenadeAt = today;
				msg.friend.setPerModulesData(this, data);

				msg.friend.incLove();
			}
		}
		//#endregion

		msg.reply(getSerif(
			msg.friend.love >= 10 ? serifs.core.nadenade.love3 :
			msg.friend.love >= 5 ? serifs.core.nadenade.love2 :
			msg.friend.love <= -15 ? serifs.core.nadenade.hate4 :
			msg.friend.love <= -10 ? serifs.core.nadenade.hate3 :
			msg.friend.love <= -5 ? serifs.core.nadenade.hate2 :
			msg.friend.love <= -1 ? serifs.core.nadenade.hate1 :
			serifs.core.nadenade.normal
		));

		return true;
	}

	@autobind
	private kawaii(msg: Message): boolean {
		if (!msg.includes(['可爱', '好看'])) return false;

		// 仅限私聊
		if (!msg.isDm) return true;

		msg.reply(getSerif(
			msg.friend.love >= 5 ? serifs.core.kawaii.love :
			msg.friend.love <= -3 ? serifs.core.kawaii.hate :
			serifs.core.kawaii.normal));

		return true;
	}

	@autobind
	private suki(msg: Message): boolean {
		if (!msg.or(['喜欢', '爱'])) return false;

		// 仅限私聊
		if (!msg.isDm) return true;

		msg.reply(
			msg.friend.love >= 5 ? (msg.friend.name ? serifs.core.suki.love(msg.friend.name) : serifs.core.suki.normal) :
			msg.friend.love <= -3 ? serifs.core.suki.hate :
			serifs.core.suki.normal);

		return true;
	}

	@autobind
	private hug(msg: Message): boolean {
		if (!msg.or(['抱'])) return false;

		// 仅限私聊
		if (!msg.isDm) return true;

		//#region 如果距离上次拥抱还没有一分钟，就不要回复了
		// 这是因为当收到「抱抱」并回答「抱抱」时，对方的
		// 很可能会再发送一个「抱抱」来回应。
		// 而且因为这个是和「抱抱」匹配的
		// 艾姬又会回复，这样就显得不够自然。
		// 所以如果上次抱抱后没过多久，为了防止这种情况发生，
		// 不要回复。
		const now = Date.now();

		const data = msg.friend.getPerModulesData(this);

		if (data.lastHuggedAt != null) {
			if (now - data.lastHuggedAt < (1000 * 60)) return true;
		}

		data.lastHuggedAt = now;
		msg.friend.setPerModulesData(this, data);
		//#endregion

		msg.reply(
			msg.friend.love >= 5 ? serifs.core.hug.love :
			msg.friend.love <= -3 ? serifs.core.hug.hate :
			serifs.core.hug.normal);

		return true;
	}

	@autobind
	private humu(msg: Message): boolean {
		if (!msg.includes(['踩'])) return false;

		// 仅限私聊
		if (!msg.isDm) return true;

		msg.reply(
			msg.friend.love >= 5 ? serifs.core.humu.love :
			msg.friend.love <= -3 ? serifs.core.humu.hate :
			serifs.core.humu.normal);

		return true;
	}

	@autobind
	private batou(msg: Message): boolean {
		if (!msg.includes(['骂'])) return false;

		// 仅限私聊
		if (!msg.isDm) return true;

		msg.reply(
			msg.friend.love >= 5 ? serifs.core.batou.love :
			msg.friend.love <= -5 ? serifs.core.batou.hate :
			serifs.core.batou.normal);

		return true;
	}

	@autobind
	private itai(msg: Message): boolean {
		if (!msg.or(['痛', '难受', '难过', '哭']) && !(msg.extractedText.endsWith('痛') || msg.extractedText.endsWith('难受') || msg.extractedText.endsWith('难过') || msg.extractedText.endsWith('哭'))) return false;

		// 仅限私聊
		if (!msg.isDm) return true;

		msg.reply(serifs.core.itai(msg.friend.name));

		return true;
	}

	@autobind
	private ote(msg: Message): boolean {
		if (!msg.or(['汪'])) return false;

		// 仅限私聊
		if (!msg.isDm) return true;

		msg.reply(
			msg.friend.love >= 10 ? serifs.core.ote.love2 :
			msg.friend.love >= 5 ? serifs.core.ote.love1 :
			serifs.core.ote.normal);

		return true;
	}

	@autobind
	private ponkotu(msg: Message): boolean | HandlerResult {
		if (!msg.includes(['废物', '垃圾'])) return false;

		msg.friend.decLove();

		return {
			reaction: 'angry'
		};
	}

	@autobind
	private rmrf(msg: Message): boolean | HandlerResult {
		if (!msg.includes(['rm -rf'])) return false;

		msg.friend.decLove();

		return {
			reaction: 'angry'
		};
	}

	@autobind
	private shutdown(msg: Message): boolean | HandlerResult {
		if (!msg.includes(['shutdown'])) return false;

		msg.reply(serifs.core.shutdown);

		return {
			reaction: 'confused'
		};
	}
}
