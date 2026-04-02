export interface FlashCardMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export interface ServiceCategory {
  name: string;
  services: FlashCardMetadata[];
}

