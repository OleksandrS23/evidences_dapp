export const EntityType =
{
    LawEnforcementAgent: 0,
    Forensics: 1,
    Court: 2,
    Lawyer: 3,
    Administrator:4
}


export function getEntityTypeDescription(enumNumb) {
    switch (parseInt(enumNumb)) {
      case EntityType.LawEnforcementAgent:
        return "Law Enforcement Agent";
      case EntityType.Forensics:
        return "Forensics";
      case EntityType.Court:
        return "Court";
      case EntityType.Lawyer:
        return "Lawyer";
      case EntityType.Administrator:
        return "Administrator";
      default:
        return "Unknown Entity Type";
    }
  }