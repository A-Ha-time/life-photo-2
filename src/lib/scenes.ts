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
  compositionHint: {
    en: string;
    zh: string;
    ko: string;
    ja: string;
  };
  cameraHint: {
    en: string;
    zh: string;
    ko: string;
    ja: string;
  };
  poseHint: {
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
    },
    compositionHint: {
      en: 'Low to mid angle, climber placed on a third, rock wall dominates the frame, upward perspective, strong diagonal lines.',
      zh: '低到中机位，人物置于三分位，岩壁占据画面主体，上仰视角，强烈对角线构图。',
      ko: '로우~미들 앵글, 인물은 3분할 위치, 암벽이 프레임을 지배, 위로 향한 시선, 대각선 구도.',
      ja: 'ロー〜ミドルアングル、人物は三分割位置、岩壁が画面を支配、上向きの視点、強い対角線構図。'
    },
    cameraHint: {
      en: 'Wide 24–35mm, slight tilt up, medium depth of field, crisp action freeze.',
      zh: '24–35mm 广角，轻微上仰，中等景深，动作凝固清晰。',
      ko: '24–35mm 와이드, 살짝 로우 앵글, 중간 심도, 액션 정지.',
      ja: '24–35mmの広角、わずかにローアングル、中程度の被写界深度、動きをシャープに停止。'
    },
    poseHint: {
      en: 'One arm extended to a hold, body close to the wall, bent knee, focused gaze upward.',
      zh: '一只手伸向抓点，身体贴近岩壁，膝盖弯曲，视线向上专注。',
      ko: '한 손을 홀드에 뻗고 몸은 암벽에 밀착, 무릎 굽힘, 위를 바라보는 집중 시선.',
      ja: '片手をホールドに伸ばし、体は壁に近く、膝を曲げ、上を見上げる集中した視線。'
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
    },
    compositionHint: {
      en: 'Low waterline perspective, wave barrel curves overhead, surfer offset to one side, dynamic diagonal motion.',
      zh: '贴近水面低机位，浪管弧线包围画面，冲浪者偏一侧，动感对角线姿态。',
      ko: '수면 가까운 로우 앵글, 파도 통이 머리 위로 곡선, 인물은 한쪽에 치우쳐, 대각선 액션.',
      ja: '水面近くのローアングル、波のチューブが頭上で弧を描く、人物は片側、動的な対角線。'
    },
    cameraHint: {
      en: 'Low waterline 50–100mm, fast shutter, golden hour backlight, ocean spray detail.',
      zh: '贴近水面 50–100mm 中长焦，快门高速，黄昏逆光，水花细节清晰。',
      ko: '수면 가까운 50–100mm, 빠른 셔터, 골든아워 역광, 물보라 디테일.',
      ja: '水面近くの50–100mm、速いシャッター、ゴールデンアワーの逆光、飛沫の質感。'
    },
    poseHint: {
      en: 'Low crouch on the board, knees bent, front arm forward, back arm trailing, eyes on the wave.',
      zh: '低姿态下蹲，膝盖弯曲，前臂向前，后臂带动，目视浪面。',
      ko: '낮게 웅크린 자세, 무릎 굽힘, 앞팔 전방, 뒷팔은 뒤로, 파도를 응시.',
      ja: '低い姿勢でしゃがみ、膝を曲げ、前腕を前へ、後腕は後方、波を見つめる。'
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
    },
    compositionHint: {
      en: 'Low-angle wide shot with leading road lines, car dominant, subject near the car door or beside the car, cinematic framing.',
      zh: '低机位广角，公路线条引导，跑车占主体，人物靠近车门或车侧，电影感构图。',
      ko: '로우 앵글 와이드 샷, 도로 리딩 라인, 차량이 주인공, 인물은 차 옆/문 근처, 시네마틱 프레이밍.',
      ja: 'ローアングルのワイドショット、道路のリーディングライン、車が主役、人物は車の横/ドア付近、シネマティック構図。'
    },
    cameraHint: {
      en: 'Low-angle wide 24–28mm, strong leading lines, cinematic contrast, slight motion blur.',
      zh: '24–28mm 低机位广角，强引导线，电影感对比，轻微运动模糊。',
      ko: '24–28mm 로우 와이드, 강한 리딩 라인, 시네마틱 대비, 약간의 모션 블러.',
      ja: '24–28mmのローアングル広角、強いリーディングライン、シネマティックなコントラスト、軽いモーションブラー。'
    },
    poseHint: {
      en: 'Relaxed confident stance by the car, slight lean on the door or walking alongside, gaze toward the horizon.',
      zh: '自信放松地站在车旁，轻靠车门或沿车行走，目视远方。',
      ko: '차 옆에서 자신감 있는 포즈, 문에 살짝 기대거나 옆을 걷는 자세, 수평선 응시.',
      ja: '車の横で自信ある立ち姿、ドアにもたれるか横を歩く、地平線を見る。'
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
    },
    compositionHint: {
      en: 'Skier mid-turn with snow spray, diagonal motion across frame, mountains in background, wide action composition.',
      zh: '滑雪者转弯溅雪，动作沿对角线穿过画面，远景雪山背景，广角运动构图。',
      ko: '스키어가 턴 중 눈보라, 대각선 이동, 산 배경, 와이드 액션 구도.',
      ja: 'スキーヤーがターン中に雪しぶき、対角線の動き、山の背景、ワイドなアクション構図。'
    },
    cameraHint: {
      en: 'Telephoto 70–200mm, fast shutter, crisp snow spray, bright alpine light.',
      zh: '70–200mm 中长焦，高速快门，雪雾清晰，明亮雪山光。',
      ko: '70–200mm 망원, 빠른 셔터, 눈보라 선명, 밝은 알파인 라이트.',
      ja: '70–200mmの望遠、速いシャッター、雪しぶきの鮮明さ、明るいアルペン光。'
    },
    poseHint: {
      en: 'Carving turn, weight on downhill ski, arms slightly forward, eyes looking downhill.',
      zh: '转弯 carving 姿态，重心在下坡雪板，双臂微向前，目视下坡。',
      ko: '카빙 턴, 체중은 하강 스키에, 팔은 약간 전방, 아래를 응시.',
      ja: 'カービングターン、重心は下側の板、腕はやや前、斜面下を見る。'
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
    },
    compositionHint: {
      en: 'Eye-level candid portrait, subject mid-frame, landmark softly in the background, balanced composition.',
      zh: '平视抓拍，人物居中或略偏，地标在背景中虚化，平衡构图。',
      ko: '아이레벨 스냅, 인물은 중앙 또는 살짝 오프, 랜드마크는 배경, 균형 구도.',
      ja: 'アイレベルのスナップ、人物は中央〜ややオフ、ランドマークは背景、バランス構図。'
    },
    cameraHint: {
      en: '35–50mm portrait, natural light, shallow depth for background softness.',
      zh: '35–50mm 人像焦段，自然光，浅景深柔化背景。',
      ko: '35–50mm 인물, 자연광, 얕은 심도 배경 흐림.',
      ja: '35–50mmのポートレート、自然光、浅い被写界深度で背景を柔らかく。'
    },
    poseHint: {
      en: 'Casual walk or slight turn toward camera, relaxed smile, hands loosely placed.',
      zh: '自然行走或轻转身，轻松微笑，手部自然摆放。',
      ko: '가볍게 걷거나 살짝 돌아보는 자세, 편안한 미소, 손은 자연스럽게.',
      ja: '自然に歩くか軽く振り向く、リラックスした笑顔、手は自然に。'
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
    },
    compositionHint: {
      en: 'Sweeping dune lines with subject on the crest, warm backlight, wide cinematic framing, wind texture in sand.',
      zh: '沙丘曲线延展，人物站在沙脊，暖色逆光，宽幅电影感，沙纹细节。',
      ko: '모래언덕 곡선, 인물은 사구 능선 위, 따뜻한 역광, 와이드 시네마틱 구도.',
      ja: '砂丘の曲線、人物は尾根に位置、暖かな逆光、ワイドなシネマティック構図。'
    },
    cameraHint: {
      en: 'Wide 24–35mm, warm sunset backlight, soft haze, high-contrast dunes.',
      zh: '24–35mm 广角，夕阳逆光，轻微薄雾，沙丘高对比。',
      ko: '24–35mm 와이드, 석양 역광, 얇은 헤이즈, 모래언덕 대비.',
      ja: '24–35mmの広角、夕日の逆光、薄いヘイズ、砂丘のコントラスト。'
    },
    poseHint: {
      en: 'Walking along the dune ridge, clothing flowing, head turned toward light.',
      zh: '沿沙脊行走，衣物飘动，头部朝向光线。',
      ko: '사구 능선을 걷는 자세, 옷자락이 흩날림, 빛을 향해 고개.',
      ja: '砂丘の稜線を歩き、服が風になびき、光の方向へ顔を向ける。'
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
    },
    compositionHint: {
      en: 'Crowd foreground, subject lit by stage lights, vibrant bokeh, energetic off-center framing.',
      zh: '人群在前景，人物被舞台灯光照亮，彩色散景，活力偏心构图。',
      ko: '군중이 전경, 인물은 무대 조명에 비침, 컬러 보케, 역동적인 오프센터 구도.',
      ja: '前景に観客、人物はステージライトに照らされ、カラーボケ、エネルギッシュなオフセンター構図。'
    },
    cameraHint: {
      en: '50–85mm, stage light bokeh, high ISO look, vivid color contrast.',
      zh: '50–85mm，人群灯光散景，高感光质感，鲜明色彩对比。',
      ko: '50–85mm, 무대 조명 보케, 하이 ISO 느낌, 선명한 색 대비.',
      ja: '50–85mm、ステージライトのボケ、高ISO感、鮮やかな色彩コントラスト。'
    },
    poseHint: {
      en: 'Looking toward the stage, arms raised or holding phone, excited expression.',
      zh: '面向舞台，举手或拿手机，兴奋表情。',
      ko: '무대를 바라보며 손을 들거나 휴대폰을 든 자세, 들뜬 표정.',
      ja: 'ステージを見つめ、腕を上げるかスマホを持つ、興奮した表情。'
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
    },
    compositionHint: {
      en: 'Medium close-up with gym equipment blurred behind, strong overhead key light, confident pose.',
      zh: '中近景人物，器械在背景虚化，顶部主光，力量感姿态。',
      ko: '중근경 인물, 배경 장비는 블러, 상단 키라이트, 자신감 있는 포즈.',
      ja: '中〜近景、背景の機材はぼかし、上からのキーライト、自信あるポーズ。'
    },
    cameraHint: {
      en: '35–50mm, hard top light, crisp detail, contrasty sweat texture.',
      zh: '35–50mm，顶部硬光，细节清晰，汗感质感对比强。',
      ko: '35–50mm, 상단 하드 라이트, 디테일 선명, 땀 질감 대비.',
      ja: '35–50mm、上からのハードライト、シャープなディテール、汗の質感コントラスト。'
    },
    poseHint: {
      en: 'Mid-rep or brief pause, muscles engaged, steady breath, focused eyes.',
      zh: '训练中或短暂停顿，肌肉发力，呼吸稳定，目光专注。',
      ko: '동작 중 또는 잠깐의 멈춤, 근육 긴장, 고른 호흡, 집중된 눈빛.',
      ja: '動作中または短い停止、筋肉の張り、落ち着いた呼吸、集中した眼差し。'
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
    },
    compositionHint: {
      en: 'Clean office lines, subject centered, shallow depth of field, soft key light, polished professional pose.',
      zh: '办公室线条干净，人物居中，浅景深，柔和主光，专业姿态。',
      ko: '깔끔한 오피스 라인, 인물 중앙, 얕은 심도, 부드러운 키라이트, 프로 포즈.',
      ja: 'クリーンなオフィスのライン、人物は中央、浅い被写界深度、柔らかなキーライト、プロのポーズ。'
    },
    cameraHint: {
      en: '50–85mm portrait, soft key light, clean background, shallow depth.',
      zh: '50–85mm 人像镜头，柔和主光，干净背景，浅景深。',
      ko: '50–85mm 인물, 부드러운 키라이트, 깔끔한 배경, 얕은 심도.',
      ja: '50–85mmのポートレート、柔らかなキーライト、クリーンな背景、浅い被写界深度。'
    },
    poseHint: {
      en: 'Upright posture, relaxed shoulders, slight smile, hands folded or holding a notebook.',
      zh: '挺直站姿，肩部放松，微笑，双手交叠或拿本子。',
      ko: '곧은 자세, 어깨는 편안하게, 미소, 손은 모으거나 노트북/노트를 듦.',
      ja: '背筋を伸ばし肩はリラックス、軽い笑み、手は組むかノートを持つ。'
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
    },
    compositionHint: {
      en: 'Subject near canvases or tools, warm window light from the side, relaxed candid posture, layered background.',
      zh: '人物靠近画布或工具，侧面窗光，随性姿态，层次丰富背景。',
      ko: '캔버스/도구 근처 인물, 측면 창광, 편안한 스냅 포즈, 레이어드 배경.',
      ja: 'キャンバスや道具の近く、横からの窓光、リラックスした姿勢、レイヤーのある背景。'
    },
    cameraHint: {
      en: '35–50mm, soft window side light, textured environment, gentle contrast.',
      zh: '35–50mm，柔和侧窗光，质感环境，柔和对比。',
      ko: '35–50mm, 부드러운 측면 창광, 질감 있는 환경, 부드러운 대비.',
      ja: '35–50mm、柔らかな窓からの側光、質感のある空間、柔らかなコントラスト。'
    },
    poseHint: {
      en: 'Holding a brush or tool, slight head tilt, thoughtful expression.',
      zh: '手持画笔或工具，头部轻微倾斜，若有所思的表情。',
      ko: '붓이나 도구를 들고, 고개 살짝 기울임, 사색적 표정.',
      ja: '筆や道具を持ち、頭を少し傾け、思索的な表情。'
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
    },
    compositionHint: {
      en: 'Full or three-quarter body, subject centered, long-leg perspective, crisp editorial framing.',
      zh: '全身或三分之二身，人物居中，拉长腿部视角，杂志质感构图。',
      ko: '전신/반신 3/4, 인물 중앙, 롱 레그 시점, 에디토리얼 프레이밍.',
      ja: '全身または3/4、人物は中央、脚長のパース、エディトリアル構図。'
    },
    cameraHint: {
      en: '85mm editorial portrait, sharp focus, clean background, high-fashion lighting.',
      zh: '85mm 时尚人像，锐利对焦，干净背景，高级时尚布光。',
      ko: '85mm 에디토리얼 인물, 선명한 초점, 깔끔한 배경, 하이패션 조명.',
      ja: '85mmのエディトリアルポートレート、シャープなフォーカス、クリーンな背景、ハイファッションの照明。'
    },
    poseHint: {
      en: 'Strong stance, one leg forward, chin slightly up, editorial gaze.',
      zh: '强势站姿，一腿向前，略抬下巴，时尚杂志眼神。',
      ko: '강한 스탠스, 한쪽 다리 전방, 턱 살짝 올림, 에디토리얼 시선.',
      ja: '力強い立ち姿、片脚を前に、顎を少し上げ、エディトリアルな視線。'
    }
  }
];

export function getSceneById(id: string) {
  return SCENES.find((s) => s.id === id) ?? null;
}
