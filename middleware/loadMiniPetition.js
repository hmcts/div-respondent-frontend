const loadMiniPetition = (req, res, next) => {
  const response = req.session.petition;
  req.session.referenceNumber = response.caseId;
  req.session.originalPetition = response.data;
  /* eslint-disable */
  if (req.session.originalPetition.marriageIsSameSexCouple !== 'Yes') {
    req.session.divorceWho = req.session.originalPetition.divorceWho === 'husband'
      ? 'wife'
      : 'husband';
  } else {
    req.session.divorceWho = req.session.originalPetition.divorceWho;
  }

  const divorceCenter = req.session.originalPetition.courts;
  req.session.divorceCenterName = req.session.originalPetition.court[divorceCenter].divorceCentre;
  /* eslint-enable */
  next();
};


module.exports = { loadMiniPetition };