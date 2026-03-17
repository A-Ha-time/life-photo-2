import type {AppLocale} from '@/i18n/routing';

export type GuideSection = {
  heading: string;
  points: string[];
};

export type GuideFaq = {
  question: string;
  answer: string;
};

export type GuideCopy = {
  title: string;
  description: string;
  intro: string;
  sections: GuideSection[];
  faqs: GuideFaq[];
};

export type Guide = {
  slug: string;
  updatedAt: string;
  copies: Partial<Record<AppLocale, GuideCopy>>;
};

const GUIDE_DATA: Guide[] = [
  {
    slug: 'ai-headshot-generator',
    updatedAt: '2026-03-16',
    copies: {
      en: {
        title: 'AI Headshot Generator: Create Professional Photos Faster',
        description:
          'Learn how to create studio-grade AI headshots for LinkedIn, resumes, and personal branding without a physical photoshoot.',
        intro:
          'A strong headshot increases profile trust and reply rates. This guide shows how to get consistent, professional results with AI.',
        sections: [
          {
            heading: 'What makes a headshot look professional',
            points: [
              'Use a clean composition with your face clearly visible.',
              'Keep lighting balanced and avoid heavy backlight.',
              'Pick neutral or business-friendly outfits for broad use.'
            ]
          },
          {
            heading: 'How to prepare input photos',
            points: [
              'Upload at least one front-facing photo with clear facial details.',
              'Avoid sunglasses, masks, and strong filters.',
              'Use recent photos so output still feels like you.'
            ]
          },
          {
            heading: 'Best use cases',
            points: [
              'LinkedIn profile image and personal website bio.',
              'Resume and speaker profile photo.',
              'Company directory and team introduction page.'
            ]
          }
        ],
        faqs: [
          {
            question: 'Can AI headshots replace a studio shoot?',
            answer:
              'For many online scenarios they can. For highly specific editorial campaigns, you may still want a traditional shoot.'
          },
          {
            question: 'How many photos should I upload?',
            answer:
              'One high-quality front-facing photo can work, but multiple angles usually improve consistency and style range.'
          }
        ]
      },
      zh: {
        title: 'AI 证件形象照指南：快速生成专业头像',
        description: '这篇指南讲清楚如何用 AI 生成用于 LinkedIn、简历与个人品牌展示的专业头像。',
        intro: '专业头像会直接影响第一印象和信任度。下面这套方法可以稳定产出更像你、也更职业的结果。',
        sections: [
          {
            heading: '什么样的头像更专业',
            points: ['构图简洁，脸部清晰可见。', '光线均匀，避免逆光导致脸部发灰。', '服装建议简洁正式，便于多场景复用。']
          },
          {
            heading: '上传照片前的准备',
            points: ['优先上传正面、清晰、无遮挡的人像。', '避免墨镜、口罩、重滤镜。', '尽量用近期照片，保证生成结果更像本人。']
          },
          {
            heading: '适用场景',
            points: ['LinkedIn 与社媒主页头像。', '简历与讲师/嘉宾介绍页。', '企业团队页与个人品牌官网。']
          }
        ],
        faqs: [
          {
            question: 'AI 头像能完全替代摄影棚吗？',
            answer: '大多数线上场景可以替代。若是高规格商业拍摄，仍可考虑专业摄影方案。'
          },
          {
            question: '至少要上传几张照片？',
            answer: '1 张清晰正面照可用，多角度照片通常能提高稳定性和风格覆盖。'
          }
        ]
      }
    }
  },
  {
    slug: 'dating-profile-photos',
    updatedAt: '2026-03-16',
    copies: {
      en: {
        title: 'Dating Profile Photos: AI Strategies That Improve Match Quality',
        description:
          'Build trustworthy and attractive dating profile photos with AI while keeping natural facial consistency.',
        intro:
          'Great dating photos are clear, authentic, and varied. AI can help you test styles quickly without looking over-edited.',
        sections: [
          {
            heading: 'Core principles for better dating photos',
            points: [
              'Prioritize natural expression over dramatic editing.',
              'Use different contexts: casual, outdoor, and social.',
              'Keep your face consistent across all selected photos.'
            ]
          },
          {
            heading: 'Style combinations that convert well',
            points: [
              'One clean close-up with direct eye contact.',
              'One full or half-body lifestyle image.',
              'One activity-based photo showing hobbies.'
            ]
          },
          {
            heading: 'Common mistakes',
            points: [
              'Using only heavily filtered or unrealistic styles.',
              'Uploading group photos where identity is unclear.',
              'Repeating near-identical poses in every image.'
            ]
          }
        ],
        faqs: [
          {
            question: 'Are AI dating photos acceptable?',
            answer:
              'Yes, if they still represent your real appearance and context honestly. Keep edits realistic and consistent.'
          },
          {
            question: 'Should all photos be polished?',
            answer:
              'No. A mix of polished and casual shots usually feels more trustworthy and performs better.'
          }
        ]
      },
      zh: {
        title: '交友照片优化指南：用 AI 提升匹配质量',
        description: '学习如何用 AI 做出真实、自然且更有吸引力的交友资料照片。',
        intro: '好的交友照片不是“修得最狠”，而是让人觉得你真实、舒服、有生活感。AI 适合快速试错与风格组合。',
        sections: [
          {
            heading: '高质量交友照片的核心',
            points: ['表情自然，比夸张特效更重要。', '场景多样：近景、生活照、兴趣照搭配。', '多张照片保持同一张脸的一致性。']
          },
          {
            heading: '推荐的照片组合',
            points: ['1 张干净清晰的近景头像。', '1 张半身或全身生活场景图。', '1 张展示兴趣爱好的活动图。']
          },
          {
            heading: '常见踩坑',
            points: ['过度滤镜导致“像假人”。', '群像太多让人分不清你是谁。', '动作和角度过于重复，信息量不足。']
          }
        ],
        faqs: [
          {
            question: 'AI 交友照片会不会不真实？',
            answer: '只要与本人外貌一致、不过度美化，就能在真实感和精致度之间取得平衡。'
          },
          {
            question: '是不是每张都要精修？',
            answer: '不建议。精致图和自然生活图混搭，通常更可信、匹配质量更高。'
          }
        ]
      }
    }
  },
  {
    slug: 'linkedin-headshots',
    updatedAt: '2026-03-16',
    copies: {
      en: {
        title: 'LinkedIn Headshots: A Practical AI Playbook for Better First Impressions',
        description:
          'Create LinkedIn-ready AI headshots that look confident, authentic, and aligned with your role.',
        intro:
          'LinkedIn visitors decide quickly. A clear professional portrait can improve profile credibility and outbound response rates.',
        sections: [
          {
            heading: 'Role-based style direction',
            points: [
              'Corporate: neutral background and formal wardrobe.',
              'Creative roles: slightly more personality while keeping clarity.',
              'Tech/startup: modern, clean look with relaxed confidence.'
            ]
          },
          {
            heading: 'Profile alignment checklist',
            points: [
              'Photo tone should match headline and industry.',
              'Avoid styles that conflict with your personal brand.',
              'Keep image quality high enough for desktop and mobile.'
            ]
          },
          {
            heading: 'When to update your headshot',
            points: [
              'New role, promotion, or industry switch.',
              'Significant appearance changes.',
              'Outdated image older than 2-3 years.'
            ]
          }
        ],
        faqs: [
          {
            question: 'What is the ideal LinkedIn headshot background?',
            answer:
              'A simple neutral or softly blurred background generally works best because it keeps focus on your face.'
          },
          {
            question: 'Can I use casual outfits?',
            answer:
              'Yes, if it matches your industry and still looks intentional. Context and consistency matter most.'
          }
        ]
      },
      zh: {
        title: 'LinkedIn 头像优化：AI 生成的实用方法',
        description: '这份实操指南帮助你产出更符合职业定位的 LinkedIn 头像，提升第一印象。',
        intro: 'LinkedIn 上的头像影响很直接。清晰、可信、与职业身份一致，往往比“过度精致”更有效。',
        sections: [
          {
            heading: '按职业方向选择风格',
            points: ['企业岗位：中性背景 + 正式穿搭。', '创意岗位：保留个性，但脸部与光线要干净。', '互联网岗位：现代简洁、自然自信。']
          },
          {
            heading: '与个人资料的一致性检查',
            points: ['头像风格要和职位标题、行业调性一致。', '避免风格与个人品牌冲突。', '保证移动端和桌面端都清晰。']
          },
          {
            heading: '什么时候该换头像',
            points: ['职位变化或转行业时。', '外形变化明显时。', '头像超过 2-3 年未更新时。']
          }
        ],
        faqs: [
          {
            question: 'LinkedIn 头像背景怎么选？',
            answer: '优先简洁中性背景，核心是把注意力留在面部。'
          },
          {
            question: '可以穿休闲装吗？',
            answer: '可以，但要与行业和个人定位一致，整体观感要“有准备感”。'
          }
        ]
      }
    }
  },
  {
    slug: 'outdoor-portrait-ideas',
    updatedAt: '2026-03-16',
    copies: {
      en: {
        title: 'Outdoor Portrait Ideas: Build Realistic Lifestyle Photos with AI',
        description:
          'Use AI to create realistic outdoor portraits for travel, fitness, and social content while preserving facial identity.',
        intro:
          'Outdoor portrait styles perform well on social platforms because they feel alive and contextual. AI can generate them quickly.',
        sections: [
          {
            heading: 'Popular scene directions',
            points: [
              'Travel landmarks and city walking shots.',
              'Nature scenes: beach, mountain, and forest.',
              'Active lifestyle scenes like cycling and hiking.'
            ]
          },
          {
            heading: 'How to keep realism high',
            points: [
              'Match clothing to weather and location context.',
              'Avoid impossible lighting or extreme color grading.',
              'Use references that align with your body posture.'
            ]
          },
          {
            heading: 'Publishing tips for social media',
            points: [
              'Mix close-up and wide shots in one carousel.',
              'Keep visual tone consistent across a weekly batch.',
              'Use caption context to reinforce authenticity.'
            ]
          }
        ],
        faqs: [
          {
            question: 'Which outdoor scenes get the best engagement?',
            answer:
              'Travel, nature, and activity-based scenes are usually strongest because they combine aesthetics and personality.'
          },
          {
            question: 'How do I avoid over-processed results?',
            answer:
              'Start with natural references, moderate styling, and realistic lighting instructions instead of dramatic effects.'
          }
        ]
      },
      zh: {
        title: '户外人像灵感：用 AI 生成更有生活感的照片',
        description: '教你用 AI 快速制作旅行、运动、生活方式类户外人像，并保持人脸一致性。',
        intro: '社媒上“有场景感”的照片更容易吸引关注。户外风格能同时体现审美和生活状态，转化率通常更高。',
        sections: [
          {
            heading: '高表现户外场景方向',
            points: ['旅行地标与城市漫步。', '海边、山野、森林等自然场景。', '骑行、徒步等运动生活场景。']
          },
          {
            heading: '提高真实感的方法',
            points: ['服装要和天气、地点一致。', '避免不合理光影和过重调色。', '参考图尽量与姿态、构图一致。']
          },
          {
            heading: '发布到社媒的建议',
            points: ['一组内容混合近景与远景。', '每周批量保持统一视觉风格。', '文案补充场景背景，增强可信度。']
          }
        ],
        faqs: [
          {
            question: '什么户外题材更容易获得互动？',
            answer: '旅行、自然、运动类通常表现更好，因为既好看又有个人故事。'
          },
          {
            question: '怎么避免看起来“P 过头”？',
            answer: '从自然参考图开始，控制风格强度，优先真实光线与合理细节。'
          }
        ]
      }
    }
  },
  {
    slug: 'instagram-profile-picture',
    updatedAt: '2026-03-16',
    copies: {
      en: {
        title: 'Instagram Profile Picture Guide: AI Styles That Stand Out',
        description:
          'Create memorable Instagram profile images with AI while keeping your identity clear at small display sizes.',
        intro:
          'Instagram profile pictures are tiny, so clarity matters more than complexity. This guide helps you optimize for visibility and brand.',
        sections: [
          {
            heading: 'Design for small avatar size',
            points: [
              'Keep your face centered and readable.',
              'Use strong contrast between subject and background.',
              'Avoid tiny details that disappear on mobile.'
            ]
          },
          {
            heading: 'Style themes that work',
            points: [
              'Clean portrait with solid background for personal brands.',
              'Lifestyle portrait with one signature color tone.',
              'Creative but simple framing for artists and creators.'
            ]
          },
          {
            heading: 'Brand consistency tips',
            points: [
              'Use similar color palette across feed and avatar.',
              'Update profile picture with major content pivots.',
              'Keep one recognizable visual anchor: pose, color, or outfit.'
            ]
          }
        ],
        faqs: [
          {
            question: 'Should I use a full-body shot for Instagram avatar?',
            answer:
              'Usually no. A close-up portrait performs better because details remain visible at very small sizes.'
          },
          {
            question: 'How often should I update my profile picture?',
            answer:
              'Update when your visual brand changes or every few months to keep the profile current.'
          }
        ]
      },
      zh: {
        title: 'Instagram 头像优化指南：AI 风格如何更出圈',
        description: '在不失真的前提下，用 AI 做出更醒目、识别度更高的 Instagram 头像。',
        intro: 'Instagram 头像尺寸很小，核心不是“复杂”，而是“看得清、记得住、和账号调性一致”。',
        sections: [
          {
            heading: '优先适配小尺寸显示',
            points: ['脸部居中，轮廓清晰。', '主体与背景形成足够对比。', '减少移动端看不见的细碎元素。']
          },
          {
            heading: '更容易出效果的风格',
            points: ['纯色背景的清爽人像。', '带统一色调的生活方式头像。', '创作者可用简洁但有辨识度的构图。']
          },
          {
            heading: '账号品牌一致性',
            points: ['头像与内容流保持相近配色。', '账号定位变化时及时换头像。', '保留一个长期识别点：姿态、色彩或服装。']
          }
        ],
        faqs: [
          {
            question: 'Instagram 头像适合全身照吗？',
            answer: '通常不建议。近景头像在小尺寸下识别度更高。'
          },
          {
            question: '多久换一次头像比较好？',
            answer: '账号定位变化时立即换；否则可按季度或主题活动更新。'
          }
        ]
      }
    }
  },
  {
    slug: 'face-consistency-in-ai-photos',
    updatedAt: '2026-03-16',
    copies: {
      en: {
        title: 'Face Consistency in AI Photos: Methods to Keep Results Stable',
        description:
          'A practical guide to maintaining face consistency across multiple AI-generated photos for social media and personal branding.',
        intro:
          'Face consistency is critical when you publish a series of photos. Stable identity builds trust and avoids uncanny results.',
        sections: [
          {
            heading: 'Why consistency drops',
            points: [
              'Input images have very different angles or lighting.',
              'Prompt style changes too aggressively between generations.',
              'Reference quality is low or facial details are unclear.'
            ]
          },
          {
            heading: 'How to improve consistency',
            points: [
              'Use one high-quality primary portrait as anchor.',
              'Control style changes gradually across batches.',
              'Keep facial features unobstructed in source photos.'
            ]
          },
          {
            heading: 'Batch workflow for creators',
            points: [
              'Generate 8-12 variants in one style family.',
              'Pick 3-5 consistent winners for publication.',
              'Archive prompt settings that produced the best identity match.'
            ]
          }
        ],
        faqs: [
          {
            question: 'Can I keep the same face across very different scenes?',
            answer:
              'Yes, but consistency improves when scene and lighting transitions are gradual rather than extreme.'
          },
          {
            question: 'Does higher resolution improve consistency?',
            answer:
              'Resolution helps detail quality, but source photo clarity and prompt control usually matter more for identity stability.'
          }
        ]
      },
      zh: {
        title: 'AI 照片人脸一致性：稳定出图的实操方法',
        description: '面向社媒创作者的人脸一致性指南，帮助你在多张 AI 照片中保持“像同一个人”。',
        intro: '连续发布内容时，人脸一致性会直接影响可信度。下面这套方法可显著减少“像换了个人”的问题。',
        sections: [
          {
            heading: '一致性下降的常见原因',
            points: ['输入照片角度和光线差异过大。', '每次生成风格跨度太大。', '参考图质量低，面部细节不足。']
          },
          {
            heading: '提升一致性的关键动作',
            points: ['固定一张高质量正面照作为锚点。', '批次之间风格渐进变化，不要突变。', '源图避免遮挡五官。']
          },
          {
            heading: '适合创作者的批量流程',
            points: ['每组先生成 8-12 张同风格变体。', '筛出 3-5 张一致性最好再发布。', '保存高命中参数，便于复用。']
          }
        ],
        faqs: [
          {
            question: '跨很大场景还能保持同一张脸吗？',
            answer: '可以，但建议循序渐进切换场景和光线，一致性会更稳。'
          },
          {
            question: '分辨率越高一致性越好吗？',
            answer: '高分辨率有帮助，但更关键的是源图清晰度和提示词控制。'
          }
        ]
      }
    }
  }
];

function getFallbackLocale(locale: AppLocale): AppLocale {
  if (locale === 'zh' || locale === 'en') return locale;
  return 'en';
}

export function getGuideSlugs() {
  return GUIDE_DATA.map((guide) => guide.slug);
}

export function getGuideMetaList() {
  return GUIDE_DATA.map((guide) => ({
    slug: guide.slug,
    updatedAt: guide.updatedAt
  }));
}

export function getGuides(locale: AppLocale) {
  const fallbackLocale = getFallbackLocale(locale);
  return GUIDE_DATA.map((guide) => {
    const copy = guide.copies[locale] ?? guide.copies[fallbackLocale] ?? guide.copies.en;
    return {
      slug: guide.slug,
      updatedAt: guide.updatedAt,
      copy
    };
  }).filter((x): x is {slug: string; updatedAt: string; copy: GuideCopy} => Boolean(x.copy));
}

export function getGuide(locale: AppLocale, slug: string) {
  const fallbackLocale = getFallbackLocale(locale);
  const guide = GUIDE_DATA.find((item) => item.slug === slug);
  if (!guide) return null;
  const copy = guide.copies[locale] ?? guide.copies[fallbackLocale] ?? guide.copies.en;
  if (!copy) return null;

  return {
    slug: guide.slug,
    updatedAt: guide.updatedAt,
    copy
  };
}

export function getRelatedGuides(locale: AppLocale, slug: string, limit = 3) {
  const guides = getGuides(locale);
  const currentIndex = guides.findIndex((item) => item.slug === slug);
  if (currentIndex < 0) return guides.slice(0, limit);

  const withoutCurrent = [...guides.slice(currentIndex + 1), ...guides.slice(0, currentIndex)];
  return withoutCurrent.slice(0, limit);
}
