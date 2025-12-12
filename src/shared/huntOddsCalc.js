import HUNT_LIST from './data/hunt-types.json';

import { getGameById } from './dataLookup';

export default function calculateOdds(huntType, modifiers) {
	if(huntType.variableOdds && modifiers.encounters !== undefined) {
		return calculateVariableOddsHunt(huntType, modifiers);
	}
	if(huntType.variableOddsObj && modifiers.encounters !== undefined) {
		return calculateVariableOddsHuntFromObj(huntType, modifiers);
	}
	if(modifiers.hasLure) {
		return calculateOddsForLetsGo(huntType, modifiers.hasShinyCharm, modifiers.hasLure);
	}
	if(modifiers.hasResearch10 || modifiers.hasResearchPerfect) {
		return calculateOddsForLegends(huntType, modifiers.hasShinyCharm, modifiers.hasResearch10, modifiers.hasResearchPerfect)
	}
	if(modifiers.hasSparklingPower) {
		return calculateOddsForSparklingPower(huntType, modifiers.hasShinyCharm, modifiers.hasSparklingPower);
	}
	return calculateNormalOdds(huntType, modifiers.hasShinyCharm);
}

export function getOddsForHunt(hunt) {
	if(hunt.isStaticOdds) {
		return hunt.odds;
	}
	const generation = getGameById(hunt.gameId).generation;
	const huntData = HUNT_LIST.find(huntEntry => huntEntry.generations.includes(generation) && huntEntry.id === hunt.huntType);

	return calculateOdds(huntData, hunt);
}

export function getAggregatePercentage(hunt) {
		const oddsString = getOddsForHunt(hunt);
		const odds = parseInt(oddsString.split('/')[0]) / parseInt(oddsString.split('/')[1]);
		const partialDist = Math.pow(1-odds, hunt.encounters);
		const finalDist = 100 * (partialDist * Math.pow(-(1 / (odds - 1)), hunt.encounters) - partialDist);
	
		const encountersTo90 = Math.ceil(Math.log(.1) / Math.log(1 - odds)) - hunt.encounters;

		return {
			oddsString: oddsString,
			percentage: finalDist,
			encountersTo90: encountersTo90,
		};
};

function calculateVariableOddsHunt(huntType, hunt) {
	let oddsArray = huntType.variableOdds;
	if(hunt.hasLure && hunt.hasShinyCharm && huntType.shinyCharmLureVariableOdds) {
		oddsArray = huntType.shinyCharmLureVariableOdds;
	} else if(hunt.hasLure && huntType.lureVariableOdds) {
		oddsArray = huntType.lureVariableOdds;
	} else if(hunt.hasShinyCharm && huntType.shinyCharmVariableOdds) {
		oddsArray = huntType.shinyCharmVariableOdds;
	}
	return oddsArray[Math.min(hunt.encounters, oddsArray.length - 1)];
}

function calculateVariableOddsHuntFromObj(huntType, hunt) {
	let oddsObj = huntType.variableOddsObj;
	if(hunt.hasShinyCharm && hunt.hasSparklingPower && huntType.sparklingShinyCharmVariableOddsObj) {
		oddsObj = huntType.sparklingShinyCharmVariableOddsObj;
	} else if(hunt.hasSparklingPower && huntType.sparklingPowerVariableOddsObj) {
		oddsObj = huntType.sparklingPowerVariableOddsObj;
	} else if(hunt.hasShinyCharm && huntType.shinyCharmVariableOddsObj) {
		oddsObj = huntType.shinyCharmVariableOddsObj;
	}

	const stepValues = Object.keys(oddsObj).map(i => parseInt(i)).sort();
	let currentOddsKey = stepValues[0];
	for (let i=0; i<stepValues.length; i++) {
		if (hunt.encounters >= stepValues[i]) {
			currentOddsKey = stepValues[i];
		}
	}

	return oddsObj[currentOddsKey.toString()];
}

function calculateOddsForLetsGo(huntType, hasShinyCharm, hasLure) {
	if(hasLure && hasShinyCharm) {
		return huntType.lureShinyCharmOdds || huntType.shinyCharmOdds || huntType.baseOdds;
	} else if(hasLure) {
		return huntType.lureOdds || huntType.baseOdds;
	} else if(hasShinyCharm) {
		return huntType.shinyCharmOdds || huntType.baseOdds;
	} else {
		return huntType.baseOdds;
	}
}

function calculateOddsForLegends(huntType, hasShinyCharm, hasResearch10, hasResearchPerfect) {
	if(hasResearchPerfect && hasShinyCharm) {
		return huntType.shinyCharmPerfectOdds || huntType.shinyCharmOdds || huntType.baseOdds;
	} else if(hasResearchPerfect) {
		return huntType.researchPerfectOdds || huntType.research10Odds || huntType.baseOdds;
	} else if(hasShinyCharm) {
		return huntType.shinyCharmOdds || huntType.baseOdds;
	} else if(hasResearch10) {
		return huntType.research10Odds || huntType.baseOdds;
	} else {
		return huntType.baseOdds;
	}
}

function calculateOddsForSparklingPower(huntType, hasShinyCharm, hasSparklingPower) {
	if(hasSparklingPower && hasShinyCharm) {
		return huntType.sparklingShinyCharmOdds || huntType.baseOdds;
	} else if(hasSparklingPower) {
		return huntType.sparklingPowerOdds || huntType.baseOdds;
	} else if(hasShinyCharm) {
		return huntType.shinyCharmOdds || huntType.baseOdds;
	} else {
		return huntType.baseOdds;
	}
}

function calculateNormalOdds(huntType, hasShinyCharm) {
	if(hasShinyCharm) {
		return huntType.shinyCharmOdds || huntType.baseOdds;
	}

	return huntType.baseOdds;
}