const DrawCard = require('../../drawcard.js');

class Mhysa extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lady' });
        this.whileAttached({
            condition: () =>
                this.game.isDuringChallenge({ challengeType: 'power' }) &&
                this.controller.getNumberOfChallengesInitiatedByType('power') === 0,
            effect: [
                ability.effects.doesNotKneelAsAttacker(),
                ability.effects.dynamicStrength(() => this.getAttackingCharacters())
            ]
        });
    }

    getAttackingCharacters() {
        if(this.game.isDuringChallenge()) {
            return 0;
        }

        return this.game.currentChallenge.attackers.length;
    }
}

Mhysa.code = '08094';

module.exports = Mhysa;
