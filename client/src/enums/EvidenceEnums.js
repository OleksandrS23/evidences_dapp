export const EvidenceClassification = {
  Public: 0,
  Secret: 1,
  AllowedPersonalOnly: 2,
};

export const EvidenceType = {
  Document: 0,
  Image: 1,
  Video: 2,
  Other: 3,
};

export function getEvidenceClassificationDescription(enumNumb) {
  switch (parseInt(enumNumb)) {
    case EvidenceClassification.Public:
      return "Public";
    case EvidenceClassification.Secret:
      return "Secret";
    case EvidenceClassification.AllowedPersonalOnly:
      return "Allowed Personal Only";
    default:
      return "Unknown Classification";
  }
}

export function getEvidenceTypeDescription(enumNumb) {
  switch (parseInt(enumNumb)) {
    case EvidenceType.Document:
      return "Document";
    case EvidenceType.Image:
      return "Image";
    case EvidenceType.Video:
      return "Video";
    case EvidenceType.Other:
      return "Other";
    default:
      return "Unknown Type";
  }
}
