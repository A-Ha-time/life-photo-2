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
  coverImageUrl: {
    male: string;
    female: string;
  };
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
    coverImageUrl: {
      male: 'https://images.unsplash.com/photo-1621803458830-50d0c5cbe9e7?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      female:
        'https://plus.unsplash.com/premium_photo-1684315354388-20165eb0a4a0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGNsaW1iaW5nfGVufDB8fDB8fHww'
    },
    promptHint: {
      en: 'climbing/bouldering wall, athletic action, chalk dust, natural light',
      zh: '攀岩/抱石墙，运动动作抓拍，粉尘与自然光',
      ko: '클라이밍/볼더링 벽, 역동적인 액션, 초크, 자연광',
      ja: 'クライミング/ボルダリング壁、ダイナミックな動き、チョーク、自然光'
    }
  },
  {
    id: 'surfing',
    name: {en: 'Surfing', zh: '冲浪激情', ko: '서핑', ja: 'サーフィン'},
    category: {en: 'Extreme', zh: '极限运动', ko: '익스트림', ja: 'エクストリーム'},
    coverImageUrl: {
      male: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop',
      female:
        'https://plus.unsplash.com/premium_photo-1672509987970-f6037d93c249?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODh8fHN1cmZpbmd8ZW58MHx8MHx8fDA%3D'
    },
    promptHint: {
      en: 'surfing inside a wave barrel, ocean spray, golden hour action',
      zh: '桶状浪冲浪，海浪水花，黄昏光线动作感',
      ko: '튜브에서 서핑, 물보라, 골든아워 액션',
      ja: 'チューブの中でサーフィン、飛沫、ゴールデンアワーのアクション'
    }
  },
  {
    id: 'racing',
    name: {en: 'Supercar', zh: '跑车', ko: '슈퍼카', ja: 'スーパーカー'},
    category: {en: 'Supercar', zh: '跑车', ko: '슈퍼카', ja: 'スーパーカー'},
    coverImageUrl: {
      male:
        'https://images.unsplash.com/photo-1638730558978-18941cc086ad?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI2fHxTdXBlcmNhcnxlbnwwfHwwfHx8MA%3D%3D',
      female:
        'https://plus.unsplash.com/premium_photo-1663047351997-c3ba1fda32b6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQxfHxTdXBlcmNhcnxlbnwwfHwwfHx8MA%3D%3D'
    },
    promptHint: {
      en: 'supercar on a scenic road, low-angle cinematic shot, motion blur, golden hour',
      zh: '超跑公路场景，低机位电影感，速度感与运动模糊，金色时刻',
      ko: '슈퍼카 오픈로드, 로우앵글 시네마틱, 모션 블러, 골든아워',
      ja: 'スーパーカーのロードシーン、ローアングルのシネマティック、モーションブラー、ゴールデンアワー'
    }
  },
  {
    id: 'skiing',
    name: {en: 'Skiing', zh: '雪山滑雪', ko: '스키', ja: 'スキー'},
    category: {en: 'Extreme', zh: '极限运动', ko: '익스트림', ja: 'エクストリーム'},
    coverImageUrl: {
      male:
        'https://plus.unsplash.com/premium_photo-1661868934236-317961f5cffb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fHNraWluZ3xlbnwwfHwwfHx8MA%3D%3D',
      female:
        'https://images.unsplash.com/photo-1614270262860-f20d4c6ab4f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTJ8fHNraWluZ3xlbnwwfHwwfHx8MA%3D%3D'
    },
    promptHint: {
      en: 'skiing on snowy slopes, alpine scenery, crisp winter light, action shot',
      zh: '雪场滑雪，雪山背景，清冽冬光，动作抓拍',
      ko: '설원 스키, 알프스 풍경, 겨울빛, 액션 샷',
      ja: '雪山のゲレンデでスキー、冬の光、アクションショット'
    }
  },
  {
    id: 'travel',
    name: {en: 'Travel', zh: '环球旅行', ko: '여행', ja: '旅行'},
    category: {en: 'Adventure', zh: '旅行探险', ko: '모험', ja: '冒険'},
    coverImageUrl: {
      male:
        'https://images.unsplash.com/photo-1588865220587-cb991cc285d0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjk2fHx0cmF2ZWwlMjBtYW58ZW58MHx8MHx8fDA%3D',
      female:
        'https://images.unsplash.com/photo-1676856561653-f2692432441b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHRyYXZlbCUyMHdvbWFufGVufDB8fDB8fHww'
    },
    promptHint: {
      en: 'travel portrait at scenic landmarks, candid, natural light',
      zh: '旅行地标/风景人像，自然抓拍，自然光',
      ko: '랜드마크 여행 인물, 자연스러운 스냅, 자연광',
      ja: 'ランドマーク旅行ポートレート、自然なスナップ、自然光'
    }
  },
  {
    id: 'desert',
    name: {en: 'Desert', zh: '沙漠探险', ko: '사막', ja: '砂漠'},
    category: {en: 'Adventure', zh: '旅行探险', ko: '모험', ja: '冒険'},
    coverImageUrl: {
      male:
        'https://images.unsplash.com/photo-1593432597028-8caf3f6ee593?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZGVzZXJ0JTIwbWFufGVufDB8fDB8fHww',
      female:
        'https://plus.unsplash.com/premium_photo-1682097587228-9966f077e0a9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRlc2VydCUyMHdvbWFufGVufDB8fDB8fHww'
    },
    promptHint: {
      en: 'desert dunes, warm sunset light, cinematic portrait',
      zh: '沙漠沙丘，暖色夕阳光，电影感人像',
      ko: '사막 모래언덕, 따뜻한 석양빛, 시네마틱 인물',
      ja: '砂丘、暖かな夕日、シネマティックな人物'
    }
  },
  {
    id: 'concert',
    name: {en: 'Concert', zh: '音乐狂欢', ko: '콘서트', ja: 'コンサート'},
    category: {en: 'Lifestyle', zh: '娱乐生活', ko: '라이프스타일', ja: 'ライフスタイル'},
    coverImageUrl: {
      male:
        'https://images.unsplash.com/photo-1718180873753-3d0a3430828d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGNvbmNlcnQlMjBtYW58ZW58MHx8MHx8fDA%3D',
      female:
        'https://plus.unsplash.com/premium_photo-1726711361574-e1621746ecb9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzd8fGNvbmNlcnQlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D'
    },
    promptHint: {
      en: 'live concert crowd, stage lights, vibrant colors, nightlife energy',
      zh: '现场音乐会人群，舞台灯光，绚丽色彩，夜生活氛围',
      ko: '라이브 콘서트, 무대 조명, 생생한 색감, 나이트라이프',
      ja: 'ライブ会場の人波、ステージライト、鮮やかな色、ナイトライフ'
    }
  },
  {
    id: 'fitness',
    name: {en: 'Fitness', zh: '健身运动', ko: '피트니스', ja: 'フィットネス'},
    category: {en: 'Lifestyle', zh: '娱乐生活', ko: '라이프스타일', ja: 'ライフスタイル'},
    coverImageUrl: {
      male:
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zml0bmVzcyUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D',
      female:
        'https://plus.unsplash.com/premium_photo-1661371369480-e506e18de311?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fGZpdG5lc3MlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D'
    },
    promptHint: {
      en: 'gym workout, clean lighting, athletic portrait, realistic sweat',
      zh: '健身房训练，干净灯光，运动人像，真实汗感',
      ko: '헬스장 운동, 깔끔한 조명, 운동 인물, 땀 리얼',
      ja: 'ジムでトレーニング、クリーンな照明、スポーツポートレート、汗の質感'
    }
  },
  {
    id: 'business',
    name: {en: 'Business', zh: '商务精英', ko: '비즈니스', ja: 'ビジネス'},
    category: {en: 'Professional', zh: '职业形象', ko: '프로', ja: 'プロ'},
    coverImageUrl: {
      male:
        'https://images.unsplash.com/photo-1541535881962-3bb380b08458?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVzaW5lc3MlMjBtYW58ZW58MHx8MHx8fDA%3D',
      female:
        'https://images.unsplash.com/photo-1585554414787-09b821c321c0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjJ8fGJ1c2luZXNzJTIwd29tYW58ZW58MHx8MHx8fDA%3D'
    },
    promptHint: {
      en: 'modern office business portrait, premium lighting, professional look',
      zh: '现代办公室商务人像，高级布光，专业形象',
      ko: '모던 오피스 비즈니스 인물, 프리미엄 조명, 프로페셔널',
      ja: 'モダンオフィスのビジネスポートレート、上質な照明、プロフェッショナル'
    }
  },
  {
    id: 'artist',
    name: {en: 'Artist', zh: '艺术创作', ko: '아티스트', ja: 'アーティスト'},
    category: {en: 'Professional', zh: '职业形象', ko: '프로', ja: 'プロ'},
    coverImageUrl: {
      male:
        'https://plus.unsplash.com/premium_photo-1693265062792-82e21b385795?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTl8fGFydGlzdCUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D',
      female:
        'https://plus.unsplash.com/premium_photo-1674814949994-0617868dadb0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTYxfHxhcnRpc3QlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D'
    },
    promptHint: {
      en: 'artist studio, creative workspace, natural light, candid portrait',
      zh: '艺术工作室，创作空间，自然光，随拍人像',
      ko: '아트 스튜디오, 창작 공간, 자연광, 스냅 인물',
      ja: 'アトリエ、制作スペース、自然光、スナップポートレート'
    }
  },
  {
    id: 'fashion',
    name: {en: 'Fashion', zh: '时尚潮流', ko: '패션', ja: 'ファッション'},
    category: {en: 'Lifestyle', zh: '娱乐生活', ko: '라이프스타일', ja: 'ライフスタイル'},
    coverImageUrl: {
      male:
        'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbiUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D',
      female:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D'
    },
    promptHint: {
      en: 'fashion editorial street style, high-end look, clean background',
      zh: '时尚街拍/杂志质感，高级质感，干净背景',
      ko: '패션 에디토리얼 스트리트, 하이엔드 무드, 깔끔한 배경',
      ja: 'ファッションエディトリアルのストリート、ハイエンド感、クリーンな背景'
    }
  }
];

export function getSceneById(id: string) {
  return SCENES.find((s) => s.id === id) ?? null;
}
