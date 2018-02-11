const utils = require('../../lib/utils');
const assert = require('assert');
const mockFS = require('mock-fs');
const sinon = require('sinon');

describe('utils test', () => {
  describe('defaultZulipPath', () => {
    const exitStub = sinon.stub(process, 'exit');
    after(() => {
      exitStub.restore();
    });

    it('should fail if default path does not exsist', () => {
      mockFS({});
      utils.parseZulipPath();
      assert(exitStub.calledOnce);
      mockFS.restore();
    });

    it('should return process.cwd is it\'s a zulip directory', () => {
      const expected = '/zulip-cloud9/zulip';
      const cwdStub = sinon.stub(process, 'cwd').returns(expected);

      const actual = utils.parseZulipPath();
      assert.deepStrictEqual(expected, actual);
      cwdStub.restore();
    });

    it('should fail if wrong path is passed', () => {
      utils.parseZulipPath('NON_EXSISTENT/PATH');
      console.log(exitStub.calledCount);
      assert(exitStub.calledTwice);
    });

    it('should return passed path is it exsists', () => {
      mockFS({
        '/home/zulip-cloud9-user/zulip': {}
      });

      const expected = '/home/zulip-cloud9-user/zulip';
      const actual = utils.parseZulipPath(expected);
      assert.deepStrictEqual(expected, actual);
      mockFS.restore();
    });
  });
});
