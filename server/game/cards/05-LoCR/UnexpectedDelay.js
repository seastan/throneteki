const _ = require('underscore');

const PlotCard = require('../../plotcard.js');

class UnexpectedDelay extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: event => event.phase === 'challenge'
            },
            handler: () => {
                this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
                this.selections = [];
                this.proceedToNextStep();
            }
        });
    }

    cancelSelection(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);
        this.proceedToNextStep();
    }

    onCardSelected(player, card) {
        this.selections.push({ player: player, card: card });
        this.game.addMessage('{0} selects {1} for {2}', player, card, this);
        this.proceedToNextStep();

        return true;
    }

    doReturn() {
        _.each(this.selections, selection => {
            selection.card.owner.returnCardToHand(selection.card);
        });
    }

    proceedToNextStep() {
        if(this.remainingPlayers.length > 0) {
            let currentPlayer = this.remainingPlayers.shift();
            this.game.promptForSelect(currentPlayer, {
                source: this,
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.power === 0 && card.attachments.length === 0,
                onSelect: (player, cards) => this.onCardSelected(player, cards),
                onCancel: (player) => this.cancelSelection(player)
            });
        } else {
            this.doReturn();
        }
    }
}

UnexpectedDelay.code = '05047';

module.exports = UnexpectedDelay;
