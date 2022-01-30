export default function calculateOdds(huntType, modifiers) {
	if(huntType.variableOdds && modifiers.encounters !== undefined) {
		return calculateVariableOddsHunt(huntType, modifiers);
	}
	if(modifiers.hasLure) {
		return calculateOddsForLetsGo(huntType, modifiers.hasShinyCharm, modifiers.hasLure);
	}
	if(modifiers.hasResearch10 || modifiers.hasResearchPerfect) {
		return calculateOddsForLegends(huntType, modifiers.hasShinyCharm, modifiers.hasResearch10, modifiers.hasResearchPerfect)
	}

	return calculateNormalOdds(huntType, modifiers.hasShinyCharm);
}

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

function calculateNormalOdds(huntType, hasShinyCharm) {
	if(hasShinyCharm) {
		return huntType.shinyCharmOdds || huntType.baseOdds;
	}

	return huntType.baseOdds;
}