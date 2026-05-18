export interface FlashCardMetadata {
  id: string;
  name: string;
  lastUpdated: string;
  description: string;
  icon: string;
  category: string;
}

export interface FlashCardCategory {
  name: string;
  services: FlashCardMetadata[];
}

