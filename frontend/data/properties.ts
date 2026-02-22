export interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  description: string;
  features: string[];
  images: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
  };
}

export const PROPERTIES: Property[] = [
  {
    id: 1,
    title: "Lüks Villa",
    location: "İstanbul, Beşiktaş",
    price: 4500000,
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    type: "Villa",
    description: "Modern tasarımlı, deniz manzaralı, özel havuzlu lüks villa. Geniş bahçe, güvenlikli site içerisinde, yüksek kaliteli malzemeler kullanılarak inşa edilmiştir.",
    features: [
      "Özel Havuz",
      "Deniz Manzarası",
      "Güvenlikli Site",
      "Akıllı Ev Sistemi",
      "Kapalı Garaj",
      "Bahçe",
      "Teras",
      "Yerden Isıtma"
    ],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.1&auto=format&fit=crop&w=2850&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566752547-c06e0a945b31?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566752421-3ec9c3ec3b76?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80"
    ],
    agent: {
      name: "Ahmet Yılmaz",
      phone: "0532 123 4567",
      email: "ahmet@onderemlak.com"
    }
  },
  {
    id: 2,
    title: "Modern Daire",
    location: "İstanbul, Kadıköy",
    price: 2500000,
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    type: "Daire",
    description: "Şehir merkezinde, metro istasyonuna yakın, yenilenmiş modern daire. Açık mutfak, geniş salon ve ferah odalar. Site içerisinde spor salonu ve yüzme havuzu bulunmaktadır.",
    features: [
      "Site İçinde",
      "Merkezi Konum",
      "Spor Salonu",
      "Yüzme Havuzu",
      "Otopark",
      "Güvenlik",
      "Asansör",
      "Ankastre Mutfak"
    ],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566752547-c06e0a945b31?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80"
    ],
    agent: {
      name: "Zeynep Kaya",
      phone: "0533 456 7890",
      email: "zeynep@onderemlak.com"
    }
  },
  {
    id: 3,
    title: "Bahçeli Ev",
    location: "İzmir, Karşıyaka",
    price: 3200000,
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    type: "Müstakil",
    description: "Geniş bahçeli, müstakil ev. Doğayla iç içe yaşam için ideal. Yeni renovasyon görmüş, modern donanımlı mutfak ve banyolar. Özel garaj ve depo alanı mevcut.",
    features: [
      "Müstakil",
      "Geniş Bahçe",
      "Özel Garaj",
      "Depo",
      "Yeni Renovasyon",
      "Modern Mutfak",
      "Güneş Enerjisi",
      "Şömine"
    ],
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566752547-c06e0a945b31?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566752421-3ec9c3ec3b76?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498e?ixlib=rb-4.0.1&auto=format&fit=crop&w=800&q=80"
    ],
    agent: {
      name: "Mehmet Demir",
      phone: "0535 789 0123",
      email: "mehmet@onderemlak.com"
    }
  },
  {
    id: 4,
    title: "Deniz Manzaralı Arsa",
    location: "Marmaris, Muğla",
    price: 5500000,
    bedrooms: 0,
    bathrooms: 0,
    area: 850,
    type: "Arsa",
    description: "Deniz manzaralı, imarlı arsa. Konut veya ticari yapılaşmaya uygun. Altyapı bağlantıları hazır, yola cepheli. Marmaris'in en değerli bölgesinde yatırıma uygun arsa.",
    features: [
      "Deniz Manzarası",
      "İmarlı",
      "Yola Cepheli",
      "Altyapı Hazır",
      "Konut İmarlı",
      "Ticari İmarlı",
      "Tapulu",
      "Parselli"
    ],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1489&q=80",
      "https://images.unsplash.com/photo-1499677525600-949aa58e9b24?ixlib=rb-4.0.1&auto=format&fit=crop&w=1489&q=80",
      "https://images.unsplash.com/photo-1584288585279-31e5f7d45560?ixlib=rb-4.0.1&auto=format&fit=crop&w=1489&q=80",
      "https://images.unsplash.com/photo-1572145261339-44d416de0052?ixlib=rb-4.0.1&auto=format&fit=crop&w=1489&q=80"
    ],
    agent: {
      name: "Ali Yıldız",
      phone: "0536 789 0123",
      email: "ali@onderemlak.com"
    }
  }
];