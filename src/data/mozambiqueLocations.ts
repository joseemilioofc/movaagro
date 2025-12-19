// Complete list of Mozambique locations - all provinces, districts, and major towns

export interface Location {
  name: string;
  lat: number;
  lng: number;
  province: string;
  district?: string;
  type: "capital" | "city" | "town" | "district";
}

export const mozambiqueLocations: Location[] = [
  // ===== MAPUTO CIDADE =====
  { name: "Maputo", lat: -25.9692, lng: 32.5732, province: "Maputo Cidade", type: "capital" },
  { name: "Catembe", lat: -26.0333, lng: 32.5500, province: "Maputo Cidade", type: "town" },
  
  // ===== MAPUTO PROVINCE =====
  { name: "Matola", lat: -25.9625, lng: 32.4589, province: "Maputo", type: "city" },
  { name: "Boane", lat: -26.0333, lng: 32.3333, province: "Maputo", district: "Boane", type: "district" },
  { name: "Marracuene", lat: -25.7333, lng: 32.6667, province: "Maputo", district: "Marracuene", type: "district" },
  { name: "Namaacha", lat: -25.9833, lng: 32.0167, province: "Maputo", district: "Namaacha", type: "district" },
  { name: "Moamba", lat: -25.5833, lng: 32.2333, province: "Maputo", district: "Moamba", type: "district" },
  { name: "Magude", lat: -25.0167, lng: 32.6500, province: "Maputo", district: "Magude", type: "district" },
  { name: "Manhiça", lat: -25.3833, lng: 32.8000, province: "Maputo", district: "Manhiça", type: "district" },
  { name: "Matutuíne", lat: -26.4333, lng: 32.7333, province: "Maputo", district: "Matutuíne", type: "district" },
  { name: "Ressano Garcia", lat: -25.4500, lng: 31.9833, province: "Maputo", type: "town" },
  { name: "Xinavane", lat: -25.0500, lng: 32.7833, province: "Maputo", type: "town" },
  { name: "Bobole", lat: -25.7000, lng: 32.5500, province: "Maputo", type: "town" },
  
  // ===== GAZA PROVINCE =====
  { name: "Xai-Xai", lat: -25.0519, lng: 35.0473, province: "Gaza", type: "capital" },
  { name: "Chókwè", lat: -24.5333, lng: 32.9833, province: "Gaza", district: "Chókwè", type: "city" },
  { name: "Chibuto", lat: -24.0833, lng: 33.5333, province: "Gaza", district: "Chibuto", type: "district" },
  { name: "Bilene", lat: -25.2833, lng: 33.2333, province: "Gaza", district: "Bilene", type: "district" },
  { name: "Mandlakazi", lat: -24.0667, lng: 34.9667, province: "Gaza", district: "Mandlakazi", type: "district" },
  { name: "Macia", lat: -25.0333, lng: 33.1000, province: "Gaza", type: "town" },
  { name: "Guijá", lat: -24.4667, lng: 33.0000, province: "Gaza", district: "Guijá", type: "district" },
  { name: "Massingir", lat: -23.9333, lng: 32.1500, province: "Gaza", district: "Massingir", type: "district" },
  { name: "Mabalane", lat: -23.7333, lng: 32.6333, province: "Gaza", district: "Mabalane", type: "district" },
  { name: "Chicualacuala", lat: -22.3500, lng: 31.9500, province: "Gaza", district: "Chicualacuala", type: "district" },
  { name: "Chigubo", lat: -23.4833, lng: 33.7833, province: "Gaza", district: "Chigubo", type: "district" },
  { name: "Limpopo", lat: -24.4167, lng: 32.5000, province: "Gaza", district: "Limpopo", type: "district" },
  { name: "Mapai", lat: -22.8333, lng: 32.0333, province: "Gaza", type: "town" },
  { name: "Zongoene", lat: -25.1000, lng: 34.7333, province: "Gaza", type: "town" },
  { name: "Caniçado", lat: -24.3167, lng: 32.5667, province: "Gaza", type: "town" },
  
  // ===== INHAMBANE PROVINCE =====
  { name: "Inhambane", lat: -23.8650, lng: 35.3833, province: "Inhambane", type: "capital" },
  { name: "Maxixe", lat: -23.8500, lng: 35.3333, province: "Inhambane", type: "city" },
  { name: "Vilankulo", lat: -22.0000, lng: 35.3167, province: "Inhambane", district: "Vilankulo", type: "city" },
  { name: "Massinga", lat: -23.3167, lng: 35.3833, province: "Inhambane", district: "Massinga", type: "district" },
  { name: "Jangamo", lat: -24.0833, lng: 35.0167, province: "Inhambane", district: "Jangamo", type: "district" },
  { name: "Morrumbene", lat: -23.6833, lng: 35.3500, province: "Inhambane", district: "Morrumbene", type: "district" },
  { name: "Homoíne", lat: -24.0167, lng: 34.7333, province: "Inhambane", district: "Homoíne", type: "district" },
  { name: "Inharrime", lat: -24.4833, lng: 34.9500, province: "Inhambane", district: "Inharrime", type: "district" },
  { name: "Zavala", lat: -24.5167, lng: 34.8500, province: "Inhambane", district: "Zavala", type: "district" },
  { name: "Panda", lat: -24.0500, lng: 34.7167, province: "Inhambane", district: "Panda", type: "district" },
  { name: "Mabote", lat: -21.9667, lng: 34.0667, province: "Inhambane", district: "Mabote", type: "district" },
  { name: "Funhalouro", lat: -22.4000, lng: 33.8833, province: "Inhambane", district: "Funhalouro", type: "district" },
  { name: "Govuro", lat: -21.5833, lng: 34.6667, province: "Inhambane", district: "Govuro", type: "district" },
  { name: "Inhassoro", lat: -21.5333, lng: 35.2167, province: "Inhambane", district: "Inhassoro", type: "district" },
  { name: "Tofo", lat: -23.8500, lng: 35.5333, province: "Inhambane", type: "town" },
  { name: "Barra", lat: -23.8000, lng: 35.5333, province: "Inhambane", type: "town" },
  { name: "Quissico", lat: -24.5333, lng: 34.7500, province: "Inhambane", type: "town" },
  
  // ===== SOFALA PROVINCE =====
  { name: "Beira", lat: -19.8436, lng: 34.8389, province: "Sofala", type: "capital" },
  { name: "Dondo", lat: -19.6167, lng: 34.7333, province: "Sofala", district: "Dondo", type: "city" },
  { name: "Gorongosa", lat: -18.6833, lng: 34.0667, province: "Sofala", district: "Gorongosa", type: "district" },
  { name: "Nhamatanda", lat: -19.1833, lng: 34.1667, province: "Sofala", district: "Nhamatanda", type: "district" },
  { name: "Marromeu", lat: -18.2833, lng: 35.9333, province: "Sofala", district: "Marromeu", type: "district" },
  { name: "Búzi", lat: -19.8833, lng: 34.1167, province: "Sofala", district: "Búzi", type: "district" },
  { name: "Chibabava", lat: -20.3000, lng: 34.3500, province: "Sofala", district: "Chibabava", type: "district" },
  { name: "Machanga", lat: -20.4667, lng: 34.7500, province: "Sofala", district: "Machanga", type: "district" },
  { name: "Cheringoma", lat: -18.5500, lng: 34.5167, province: "Sofala", district: "Cheringoma", type: "district" },
  { name: "Muanza", lat: -19.3500, lng: 34.0500, province: "Sofala", district: "Muanza", type: "district" },
  { name: "Caia", lat: -17.8333, lng: 35.3333, province: "Sofala", district: "Caia", type: "district" },
  { name: "Chemba", lat: -17.2000, lng: 34.9000, province: "Sofala", district: "Chemba", type: "district" },
  { name: "Inhaminga", lat: -18.4000, lng: 34.7000, province: "Sofala", type: "town" },
  { name: "Manga", lat: -19.8000, lng: 34.8500, province: "Sofala", type: "town" },
  
  // ===== MANICA PROVINCE =====
  { name: "Chimoio", lat: -19.1164, lng: 33.4833, province: "Manica", type: "capital" },
  { name: "Manica", lat: -18.9500, lng: 32.8833, province: "Manica", district: "Manica", type: "city" },
  { name: "Catandica", lat: -18.0500, lng: 33.1833, province: "Manica", district: "Báruè", type: "town" },
  { name: "Gondola", lat: -19.0833, lng: 33.6667, province: "Manica", district: "Gondola", type: "district" },
  { name: "Sussundenga", lat: -19.3333, lng: 33.2333, province: "Manica", district: "Sussundenga", type: "district" },
  { name: "Báruè", lat: -17.6333, lng: 33.4000, province: "Manica", district: "Báruè", type: "district" },
  { name: "Mossurize", lat: -20.2333, lng: 33.2333, province: "Manica", district: "Mossurize", type: "district" },
  { name: "Machaze", lat: -20.0833, lng: 33.8667, province: "Manica", district: "Machaze", type: "district" },
  { name: "Guro", lat: -17.5500, lng: 33.5333, province: "Manica", district: "Guro", type: "district" },
  { name: "Tambara", lat: -17.9333, lng: 33.5167, province: "Manica", district: "Tambara", type: "district" },
  { name: "Macossa", lat: -17.9167, lng: 33.9500, province: "Manica", district: "Macossa", type: "district" },
  { name: "Vanduzi", lat: -19.0167, lng: 33.5333, province: "Manica", type: "town" },
  { name: "Matsinho", lat: -18.5500, lng: 32.9500, province: "Manica", type: "town" },
  { name: "Espungabera", lat: -20.4333, lng: 32.7667, province: "Manica", type: "town" },
  
  // ===== TETE PROVINCE =====
  { name: "Tete", lat: -16.1564, lng: 33.5867, province: "Tete", type: "capital" },
  { name: "Moatize", lat: -16.1167, lng: 33.7500, province: "Tete", district: "Moatize", type: "city" },
  { name: "Songo", lat: -15.6167, lng: 32.7667, province: "Tete", type: "town" },
  { name: "Ulónguè", lat: -14.7167, lng: 34.3667, province: "Tete", district: "Angónia", type: "town" },
  { name: "Changara", lat: -16.3833, lng: 33.1833, province: "Tete", district: "Changara", type: "district" },
  { name: "Zumbo", lat: -15.6167, lng: 30.4167, province: "Tete", district: "Zumbo", type: "district" },
  { name: "Cahora Bassa", lat: -15.6000, lng: 32.7167, province: "Tete", district: "Cahora Bassa", type: "district" },
  { name: "Angónia", lat: -14.6667, lng: 34.3000, province: "Tete", district: "Angónia", type: "district" },
  { name: "Tsangano", lat: -14.8167, lng: 34.2500, province: "Tete", district: "Tsangano", type: "district" },
  { name: "Macanga", lat: -15.1833, lng: 34.1333, province: "Tete", district: "Macanga", type: "district" },
  { name: "Chiuta", lat: -14.8500, lng: 33.6500, province: "Tete", district: "Chiuta", type: "district" },
  { name: "Chifunde", lat: -14.6000, lng: 33.5167, province: "Tete", district: "Chifunde", type: "district" },
  { name: "Marara", lat: -16.5333, lng: 34.3167, province: "Tete", district: "Marara", type: "district" },
  { name: "Mutarara", lat: -17.4333, lng: 35.0833, province: "Tete", district: "Mutarara", type: "district" },
  { name: "Dôa", lat: -15.2833, lng: 34.0500, province: "Tete", district: "Dôa", type: "district" },
  { name: "Mágoè", lat: -15.7833, lng: 31.2167, province: "Tete", district: "Mágoè", type: "district" },
  { name: "Nyamapanda", lat: -16.3667, lng: 32.5500, province: "Tete", type: "town" },
  { name: "Chipanga", lat: -16.4000, lng: 34.0667, province: "Tete", type: "town" },
  { name: "Zobue", lat: -15.6333, lng: 33.0667, province: "Tete", type: "town" },
  { name: "Fingoe", lat: -15.0167, lng: 31.0500, province: "Tete", type: "town" },
  
  // ===== ZAMBÉZIA PROVINCE =====
  { name: "Quelimane", lat: -17.8786, lng: 36.8883, province: "Zambézia", type: "capital" },
  { name: "Mocuba", lat: -16.8500, lng: 36.9833, province: "Zambézia", district: "Mocuba", type: "city" },
  { name: "Gurué", lat: -15.4667, lng: 36.9833, province: "Zambézia", district: "Gurué", type: "city" },
  { name: "Milange", lat: -16.1167, lng: 35.7667, province: "Zambézia", district: "Milange", type: "district" },
  { name: "Alto Molócuè", lat: -15.6167, lng: 37.7000, province: "Zambézia", district: "Alto Molócuè", type: "district" },
  { name: "Nicoadala", lat: -17.6167, lng: 36.8333, province: "Zambézia", district: "Nicoadala", type: "district" },
  { name: "Maganja da Costa", lat: -17.3167, lng: 37.5000, province: "Zambézia", district: "Maganja da Costa", type: "district" },
  { name: "Pebane", lat: -17.2667, lng: 38.1500, province: "Zambézia", district: "Pebane", type: "district" },
  { name: "Namacurra", lat: -17.4167, lng: 36.9500, province: "Zambézia", district: "Namacurra", type: "district" },
  { name: "Morrumbala", lat: -17.3167, lng: 35.5833, province: "Zambézia", district: "Morrumbala", type: "district" },
  { name: "Chinde", lat: -18.5833, lng: 36.4667, province: "Zambézia", district: "Chinde", type: "district" },
  { name: "Lugela", lat: -16.3167, lng: 36.4000, province: "Zambézia", district: "Lugela", type: "district" },
  { name: "Inhassunge", lat: -18.0167, lng: 36.4333, province: "Zambézia", district: "Inhassunge", type: "district" },
  { name: "Gilé", lat: -16.1500, lng: 38.3167, province: "Zambézia", district: "Gilé", type: "district" },
  { name: "Ile", lat: -15.9167, lng: 37.3500, province: "Zambézia", district: "Ile", type: "district" },
  { name: "Mopeia", lat: -17.9667, lng: 35.7167, province: "Zambézia", district: "Mopeia", type: "district" },
  { name: "Namarroi", lat: -15.8500, lng: 36.7000, province: "Zambézia", district: "Namarroi", type: "district" },
  { name: "Errego", lat: -16.1000, lng: 37.0667, province: "Zambézia", district: "Errego", type: "district" },
  { name: "Mulevala", lat: -16.0167, lng: 37.5000, province: "Zambézia", district: "Mulevala", type: "district" },
  { name: "Derre", lat: -17.7833, lng: 35.6667, province: "Zambézia", district: "Derre", type: "district" },
  { name: "Luabo", lat: -18.4000, lng: 36.1333, province: "Zambézia", district: "Luabo", type: "district" },
  { name: "Mocubela", lat: -17.0333, lng: 38.0167, province: "Zambézia", district: "Mocubela", type: "district" },
  { name: "Lioma", lat: -15.4833, lng: 37.6500, province: "Zambézia", type: "town" },
  
  // ===== NAMPULA PROVINCE =====
  { name: "Nampula", lat: -15.1167, lng: 39.2667, province: "Nampula", type: "capital" },
  { name: "Nacala", lat: -14.5667, lng: 40.6833, province: "Nampula", district: "Nacala-Porto", type: "city" },
  { name: "Angoche", lat: -16.2333, lng: 39.9167, province: "Nampula", district: "Angoche", type: "city" },
  { name: "Monapo", lat: -15.0333, lng: 40.2667, province: "Nampula", district: "Monapo", type: "district" },
  { name: "Ilha de Moçambique", lat: -15.0333, lng: 40.7333, province: "Nampula", district: "Ilha de Moçambique", type: "city" },
  { name: "Ribaué", lat: -15.0667, lng: 38.2667, province: "Nampula", district: "Ribaué", type: "district" },
  { name: "Malema", lat: -14.9500, lng: 37.4000, province: "Nampula", district: "Malema", type: "district" },
  { name: "Meconta", lat: -15.1000, lng: 39.5667, province: "Nampula", district: "Meconta", type: "district" },
  { name: "Murrupula", lat: -15.5000, lng: 38.7667, province: "Nampula", district: "Murrupula", type: "district" },
  { name: "Mecubúri", lat: -14.6833, lng: 38.6167, province: "Nampula", district: "Mecubúri", type: "district" },
  { name: "Nacarôa", lat: -14.5833, lng: 39.8500, province: "Nampula", district: "Nacarôa", type: "district" },
  { name: "Muecate", lat: -14.9167, lng: 39.5167, province: "Nampula", district: "Muecate", type: "district" },
  { name: "Mogincual", lat: -16.0500, lng: 39.6667, province: "Nampula", district: "Mogincual", type: "district" },
  { name: "Lalaua", lat: -14.4333, lng: 38.2500, province: "Nampula", district: "Lalaua", type: "district" },
  { name: "Memba", lat: -14.1667, lng: 40.4333, province: "Nampula", district: "Memba", type: "district" },
  { name: "Moma", lat: -16.7333, lng: 39.3500, province: "Nampula", district: "Moma", type: "district" },
  { name: "Rapale", lat: -15.0833, lng: 39.3167, province: "Nampula", district: "Rapale", type: "district" },
  { name: "Eráti", lat: -14.5500, lng: 39.5333, province: "Nampula", district: "Eráti", type: "district" },
  { name: "Larde", lat: -16.4167, lng: 39.7000, province: "Nampula", district: "Larde", type: "district" },
  { name: "Liúpo", lat: -16.0833, lng: 39.2333, province: "Nampula", district: "Liúpo", type: "district" },
  { name: "Mossuril", lat: -15.0167, lng: 40.4833, province: "Nampula", district: "Mossuril", type: "district" },
  { name: "Nacala-a-Velha", lat: -14.5167, lng: 40.4167, province: "Nampula", district: "Nacala-a-Velha", type: "district" },
  { name: "Nacaroa", lat: -14.7833, lng: 39.8333, province: "Nampula", type: "town" },
  { name: "Namapa", lat: -14.4667, lng: 39.5333, province: "Nampula", type: "town" },
  
  // ===== NIASSA PROVINCE =====
  { name: "Lichinga", lat: -13.3000, lng: 35.2333, province: "Niassa", type: "capital" },
  { name: "Cuamba", lat: -14.8000, lng: 36.5333, province: "Niassa", district: "Cuamba", type: "city" },
  { name: "Mandimba", lat: -14.3500, lng: 35.7167, province: "Niassa", district: "Mandimba", type: "district" },
  { name: "Marrupa", lat: -13.1833, lng: 37.5000, province: "Niassa", district: "Marrupa", type: "district" },
  { name: "Metangula", lat: -12.7000, lng: 34.7500, province: "Niassa", district: "Lago", type: "town" },
  { name: "Ngauma", lat: -13.1333, lng: 35.5333, province: "Niassa", district: "Ngauma", type: "district" },
  { name: "Sanga", lat: -12.4833, lng: 35.0667, province: "Niassa", district: "Sanga", type: "district" },
  { name: "Mavago", lat: -12.3500, lng: 36.5000, province: "Niassa", district: "Mavago", type: "district" },
  { name: "Majune", lat: -13.5833, lng: 36.2000, province: "Niassa", district: "Majune", type: "district" },
  { name: "Mecanhelas", lat: -14.4167, lng: 35.3000, province: "Niassa", district: "Mecanhelas", type: "district" },
  { name: "Muembe", lat: -13.2667, lng: 36.7000, province: "Niassa", district: "Muembe", type: "district" },
  { name: "Mecula", lat: -12.5667, lng: 37.3833, province: "Niassa", district: "Mecula", type: "district" },
  { name: "Nipepe", lat: -14.1833, lng: 36.8500, province: "Niassa", district: "Nipepe", type: "district" },
  { name: "Metarica", lat: -14.3000, lng: 36.1000, province: "Niassa", district: "Metarica", type: "district" },
  { name: "N'gauma", lat: -13.2833, lng: 35.4500, province: "Niassa", district: "N'gauma", type: "district" },
  { name: "Lago", lat: -12.8000, lng: 34.8333, province: "Niassa", district: "Lago", type: "district" },
  { name: "Chimbonila", lat: -13.4500, lng: 35.0167, province: "Niassa", district: "Chimbonila", type: "district" },
  { name: "Maua", lat: -14.5833, lng: 37.6667, province: "Niassa", district: "Maua", type: "district" },
  { name: "Entre-Lagos", lat: -13.1167, lng: 35.1000, province: "Niassa", type: "town" },
  
  // ===== CABO DELGADO PROVINCE =====
  { name: "Pemba", lat: -12.9667, lng: 40.5000, province: "Cabo Delgado", type: "capital" },
  { name: "Montepuez", lat: -13.1333, lng: 39.0000, province: "Cabo Delgado", district: "Montepuez", type: "city" },
  { name: "Chiúre", lat: -13.4167, lng: 39.8500, province: "Cabo Delgado", district: "Chiúre", type: "district" },
  { name: "Mocímboa da Praia", lat: -11.3500, lng: 40.3500, province: "Cabo Delgado", district: "Mocímboa da Praia", type: "city" },
  { name: "Palma", lat: -10.7667, lng: 40.4667, province: "Cabo Delgado", district: "Palma", type: "district" },
  { name: "Mueda", lat: -11.6833, lng: 39.5500, province: "Cabo Delgado", district: "Mueda", type: "district" },
  { name: "Macomia", lat: -12.2333, lng: 40.1333, province: "Cabo Delgado", district: "Macomia", type: "district" },
  { name: "Ancuabe", lat: -13.0500, lng: 39.8500, province: "Cabo Delgado", district: "Ancuabe", type: "district" },
  { name: "Ibo", lat: -12.3500, lng: 40.6000, province: "Cabo Delgado", district: "Ibo", type: "district" },
  { name: "Mecúfi", lat: -13.3000, lng: 40.5833, province: "Cabo Delgado", district: "Mecúfi", type: "district" },
  { name: "Metuge", lat: -12.6667, lng: 40.1500, province: "Cabo Delgado", district: "Metuge", type: "district" },
  { name: "Quissanga", lat: -12.4500, lng: 40.5167, province: "Cabo Delgado", district: "Quissanga", type: "district" },
  { name: "Balama", lat: -13.3667, lng: 38.5667, province: "Cabo Delgado", district: "Balama", type: "district" },
  { name: "Namuno", lat: -13.6833, lng: 38.7333, province: "Cabo Delgado", district: "Namuno", type: "district" },
  { name: "Muidumbe", lat: -11.9500, lng: 39.5833, province: "Cabo Delgado", district: "Muidumbe", type: "district" },
  { name: "Nangade", lat: -11.0833, lng: 39.7500, province: "Cabo Delgado", district: "Nangade", type: "district" },
  { name: "Meluco", lat: -12.4833, lng: 39.8167, province: "Cabo Delgado", district: "Meluco", type: "district" },
  { name: "Afungi", lat: -10.9167, lng: 40.1333, province: "Cabo Delgado", type: "town" },
  { name: "Chai", lat: -13.2000, lng: 38.1333, province: "Cabo Delgado", type: "town" },
  { name: "Nairoto", lat: -13.0333, lng: 38.3333, province: "Cabo Delgado", type: "town" },
];

// Popular routes with historical data
export const popularRoutes = [
  { origin: "Maputo", destination: "Beira", avgPrice: 85000, frequency: "muito alta", cargo: "Diversos" },
  { origin: "Maputo", destination: "Nampula", avgPrice: 145000, frequency: "alta", cargo: "Diversos" },
  { origin: "Beira", destination: "Tete", avgPrice: 42000, frequency: "alta", cargo: "Milho/Soja" },
  { origin: "Nacala", destination: "Nampula", avgPrice: 12000, frequency: "muito alta", cargo: "Importação" },
  { origin: "Beira", destination: "Chimoio", avgPrice: 18000, frequency: "muito alta", cargo: "Diversos" },
  { origin: "Quelimane", destination: "Nampula", avgPrice: 28000, frequency: "alta", cargo: "Arroz" },
  { origin: "Tete", destination: "Moatize", avgPrice: 5000, frequency: "muito alta", cargo: "Carvão" },
  { origin: "Lichinga", destination: "Cuamba", avgPrice: 22000, frequency: "média", cargo: "Feijão" },
  { origin: "Pemba", destination: "Montepuez", avgPrice: 15000, frequency: "alta", cargo: "Castanha" },
  { origin: "Maputo", destination: "Xai-Xai", avgPrice: 15000, frequency: "alta", cargo: "Diversos" },
  { origin: "Inhambane", destination: "Maputo", avgPrice: 32000, frequency: "alta", cargo: "Coco/Copra" },
  { origin: "Chimoio", destination: "Manica", avgPrice: 8000, frequency: "alta", cargo: "Hortícolas" },
  { origin: "Gurué", destination: "Quelimane", avgPrice: 25000, frequency: "média", cargo: "Chá/Café" },
  { origin: "Mocuba", destination: "Quelimane", avgPrice: 12000, frequency: "alta", cargo: "Arroz" },
  { origin: "Nampula", destination: "Pemba", avgPrice: 35000, frequency: "média", cargo: "Diversos" },
  { origin: "Tete", destination: "Songo", avgPrice: 18000, frequency: "média", cargo: "Equipamentos" },
  { origin: "Maputo", destination: "Chókwè", avgPrice: 25000, frequency: "alta", cargo: "Arroz/Açúcar" },
  { origin: "Beira", destination: "Marromeu", avgPrice: 35000, frequency: "média", cargo: "Açúcar" },
  { origin: "Vilankulo", destination: "Inhambane", avgPrice: 18000, frequency: "média", cargo: "Peixe" },
  { origin: "Angoche", destination: "Nampula", avgPrice: 20000, frequency: "média", cargo: "Sal/Peixe" },
];

// Get all unique city names
export const getAllCityNames = (): string[] => {
  return [...new Set(mozambiqueLocations.map(loc => loc.name))].sort();
};

// Get cities grouped by province
export const getCitiesByProvince = (): Record<string, Location[]> => {
  return mozambiqueLocations.reduce((acc, loc) => {
    if (!acc[loc.province]) {
      acc[loc.province] = [];
    }
    acc[loc.province].push(loc);
    return acc;
  }, {} as Record<string, Location[]>);
};

// Calculate distance between two cities using Haversine formula
export const calculateDistance = (city1: string, city2: string): number => {
  const c1 = mozambiqueLocations.find(c => c.name === city1);
  const c2 = mozambiqueLocations.find(c => c.name === city2);
  
  if (!c1 || !c2) return 500;
  if (city1 === city2) return 0;
  
  const R = 6371; // Earth's radius in km
  const dLat = (c2.lat - c1.lat) * Math.PI / 180;
  const dLon = (c2.lng - c1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(c1.lat * Math.PI / 180) * Math.cos(c2.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const straightLineDistance = R * c;
  
  // Add 35% for road distance approximation (Mozambique's roads aren't always direct)
  return Math.round(straightLineDistance * 1.35);
};
