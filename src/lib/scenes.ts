export type Scene = {
  id: string;
  name: {
    en: string;
    zh: string;
    ko: string;
    ja: string;
  };
  category: {
    en: string;
    zh: string;
    ko: string;
    ja: string;
  };
  coverImageUrl: string;
  promptHint: {
    en: string;
    zh: string;
    ko: string;
    ja: string;
  };
};

export const SCENES: Scene[] = [
  {
    id: 'climbing',
    name: {en: 'Climbing', zh: '攀岩挑战', ko: '클라이밍', ja: 'クライミング'},
    category: {en: 'Extreme', zh: '极限运动', ko: '익스트림', ja: 'エクストリーム'},
    coverImageUrl:
      'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=300&fit=crop',
    promptHint: {
      en: 'rock climbing on a dramatic cliff, outdoor sports photography',
      zh: '在峭壁攀岩，户外运动摄影风格',
      ko: '절벽에서 클라이밍, 아웃도어 스포츠 사진',
      ja: '断崖でクライミング、アウトドアスポーツ写真'
    }
  },
  {
    id: 'surfing',
    name: {en: 'Surfing', zh: '冲浪激情', ko: '서핑', ja: 'サーフィン'},
    category: {en: 'Extreme', zh: '极限运动', ko: '익스트림', ja: 'エクストリーム'},
    coverImageUrl:
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop',
    promptHint: {
      en: 'surfing on ocean waves, golden hour, action photo',
      zh: '海浪冲浪，日落金色时刻，动作抓拍',
      ko: '파도 위 서핑, 골든아워, 액션 사진',
      ja: '波の上でサーフィン、ゴールデンアワー、アクション写真'
    }
  },
  {
    id: 'racing',
    name: {en: 'Racing', zh: '赛车竞速', ko: '레이싱', ja: 'レース'},
    category: {en: 'Extreme', zh: '极限运动', ko: '익스트림', ja: 'エクストリーム'},
    coverImageUrl:
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop',
    promptHint: {
      en: 'sports car track, cinematic, motion blur, high contrast',
      zh: '赛道与赛车，电影感，速度感与运动模糊',
      ko: '서킷과 스포츠카, 시네마틱, 모션 블러',
      ja: 'サーキットとスポーツカー、シネマティック、モーションブラー'
    }
  },
  {
    id: 'skiing',
    name: {en: 'Skiing', zh: '雪山滑雪', ko: '스키', ja: 'スキー'},
    category: {en: 'Extreme', zh: '极限运动', ko: '익스트림', ja: 'エクストリーム'},
    coverImageUrl:
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    promptHint: {
      en: 'skiing on snowy mountains, crisp winter light, action shot',
      zh: '雪山滑雪，清冽冬日光线，动作抓拍',
      ko: '설산 스키, 겨울빛, 액션 샷',
      ja: '雪山でスキー、冬の光、アクションショット'
    }
  },
  {
    id: 'travel',
    name: {en: 'Travel', zh: '环球旅行', ko: '여행', ja: '旅行'},
    category: {en: 'Adventure', zh: '旅行探险', ko: '모험', ja: '冒険'},
    coverImageUrl:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
    promptHint: {
      en: 'travel portrait in a landmark city, natural candid photography',
      zh: '地标城市旅行人像，自然抓拍摄影',
      ko: '도시 랜드마크 여행 인물 사진, 자연스러운 스냅',
      ja: '都市のランドマークで旅行ポートレート、自然なスナップ'
    }
  },
  {
    id: 'desert',
    name: {en: 'Desert', zh: '沙漠探险', ko: '사막', ja: '砂漠'},
    category: {en: 'Adventure', zh: '旅行探险', ko: '모험', ja: '冒険'},
    coverImageUrl:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop',
    promptHint: {
      en: 'desert adventure, dunes, warm sunlight, cinematic portrait',
      zh: '沙丘探险，暖阳光线，电影感人像',
      ko: '사막 모래언덕, 따뜻한 햇빛, 시네마틱 인물',
      ja: '砂丘の冒険、暖かい日差し、シネマティックな人物'
    }
  },
  {
    id: 'concert',
    name: {en: 'Concert', zh: '音乐狂欢', ko: '콘서트', ja: 'コンサート'},
    category: {en: 'Lifestyle', zh: '娱乐生活', ko: '라이프스타일', ja: 'ライフスタイル'},
    coverImageUrl:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
    promptHint: {
      en: 'concert crowd, stage lights, vibrant colors, nightlife photo',
      zh: '音乐会现场与灯光，夜生活照片，色彩绚丽',
      ko: '콘서트 조명, 생생한 색감, 나이트라이프 사진',
      ja: 'ライブ会場の照明、鮮やかな色、ナイトライフ写真'
    }
  },
  {
    id: 'food',
    name: {en: 'Fine Dining', zh: '美食体验', ko: '미식', ja: 'グルメ'},
    category: {en: 'Lifestyle', zh: '娱乐生活', ko: '라이프스타일', ja: 'ライフスタイル'},
    coverImageUrl:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    promptHint: {
      en: 'fine dining restaurant, cozy atmosphere, tasteful portrait',
      zh: '精致餐厅氛围，人像与美食同框',
      ko: '레스토랑 분위기, 인물+음식, 감성 사진',
      ja: 'レストランの雰囲気、人物と料理、上品な写真'
    }
  },
  {
    id: 'fitness',
    name: {en: 'Fitness', zh: '健身运动', ko: '피트니스', ja: 'フィットネス'},
    category: {en: 'Lifestyle', zh: '娱乐生活', ko: '라이프스타일', ja: 'ライフスタイル'},
    coverImageUrl:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    promptHint: {
      en: 'gym workout, clean lighting, athletic portrait, realistic',
      zh: '健身房训练，干净光线，真实运动人像',
      ko: '헬스장 운동, 깔끔한 조명, 리얼 인물',
      ja: 'ジムでワークアウト、クリーンな照明、リアルな人物'
    }
  },
  {
    id: 'business',
    name: {en: 'Business', zh: '商务精英', ko: '비즈니스', ja: 'ビジネス'},
    category: {en: 'Professional', zh: '职业形象', ko: '프로', ja: 'プロ'},
    coverImageUrl:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop',
    promptHint: {
      en: 'business portrait in modern office, premium lighting, professional',
      zh: '现代办公室商务人像，高级布光，专业质感',
      ko: '현대 오피스 비즈니스 인물, 프리미엄 조명',
      ja: 'モダンオフィスのビジネスポートレート、上質な照明'
    }
  },
  {
    id: 'artist',
    name: {en: 'Artist', zh: '艺术创作', ko: '아티스트', ja: 'アーティスト'},
    category: {en: 'Professional', zh: '职业形象', ko: '프로', ja: 'プロ'},
    coverImageUrl:
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=300&fit=crop',
    promptHint: {
      en: 'artist studio, creative atmosphere, natural portrait photography',
      zh: '艺术工作室，创作氛围，自然人像摄影',
      ko: '아트 스튜디오, 창작 분위기, 자연스러운 인물',
      ja: 'アトリエ、創作の雰囲気、自然な人物写真'
    }
  },
  {
    id: 'fashion',
    name: {en: 'Fashion', zh: '时尚潮流', ko: '패션', ja: 'ファッション'},
    category: {en: 'Lifestyle', zh: '娱乐生活', ko: '라이프스타일', ja: 'ライフスタイル'},
    coverImageUrl:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
    promptHint: {
      en: 'fashion street style, editorial photo, realistic skin texture',
      zh: '街头时尚，杂志大片质感，真实皮肤纹理',
      ko: '스트리트 패션, 에디토리얼, 피부 질감 리얼',
      ja: 'ストリートファッション、エディトリアル、肌の質感リアル'
    }
  }
];

export function getSceneById(id: string) {
  return SCENES.find((s) => s.id === id) ?? null;
}

