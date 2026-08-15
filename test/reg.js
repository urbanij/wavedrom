'use strict';

var fs = require('fs');
var path = require('path');
var renderAny = require('../lib/render-any.js');
var waveSkin = require('../skins/default.js');
var onml = require('onml');
var chai = require('chai');
var expect = chai.expect;

var OUT_DIR = path.join(__dirname, 'out');

describe('reg', function () {
    it('basic', function (done) {
        expect(renderAny(0,
            {reg: [
                {name: 'a', bits: 8},
                {name: 'b', bits: 8},
                {name: 'c', bits: 1}
            ]}, waveSkin
        )).to.be.an('array');
        done();
    });

    it('autoLanes increases lanes when field names are too wide', function (done) {
        var desc = [
            {name: 'INSTRUCTION_POINTER_REGISTER', bits: 4},
            {name: 'STACK_POINTER', bits: 4}
        ];
        var without = renderAny(0,
            {reg: desc, config: {hspace: 200, lanes: 1}}, waveSkin
        );
        var withAuto = renderAny(0,
            {reg: desc, config: {hspace: 200, lanes: 1, autoLanes: true}}, waveSkin
        );
        expect(without).to.be.an('array');
        expect(withAuto).to.be.an('array');
        expect(withAuto[1].height).to.be.greaterThan(without[1].height);

        fs.mkdirSync(OUT_DIR, {recursive: true});
        fs.writeFileSync(
            path.join(OUT_DIR, 'reg-auto-lanes-off.svg'),
            onml.stringify(without, 2)
        );
        fs.writeFileSync(
            path.join(OUT_DIR, 'reg-auto-lanes-on.svg'),
            onml.stringify(withAuto, 2)
        );
        done();
    });
});
/* eslint-env mocha */
