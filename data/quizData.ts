export interface QuizQuestion {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface RelatedExamQuestion {
  id: string;
  sourceTitle: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
  relatedPassage?: string; // 이 줄을 추가하세요!
}

export interface CharacterRelation {
  from: string;
  to: string;
  type: "supporter" | "antagonist" | "family" | "neutral";
  label: string;
}

export interface CharacterMapData {
  characters: { name: string; role: string; description: string }[];
  relations: CharacterRelation[];
}

export type NarrativePhase =
  | "exposition"
  | "rising"
  | "climax"
  | "falling"
  | "resolution";

export interface NarrativeSection {
  phase: NarrativePhase;
  title: string;
  summary: string;
}

export type GrandUnit = "literature" | "non_fiction";

export interface QuizPassage {
  id: string;
  grandUnit: GrandUnit;
  categoryId: string;
  title: string;
  author: string;
  source: string;
  passage: string;
  originalText?: string;
  modernText?: string;
  questions: QuizQuestion[];
  relatedExams?: RelatedExamQuestion[];
  narrativePhase?: NarrativePhase;
  narrativeSections?: NarrativeSection[];
  characterMap?: CharacterMapData;
}

export const grandUnitConfig = {
  literature: {
    id: "literature" as GrandUnit,
    name: "문학",
    nameEn: "Literature",
    categories: [
      "modern-poetry",
      "modern-novel",
      "classic-poetry",
      "classic-novel",
    ],
  },
  non_fiction: {
    id: "non_fiction" as GrandUnit,
    name: "독서",
    nameEn: "Non-fiction",
    categories: [],
  },
};

// ⚠️ 함수를 파일 상단에 정의하여 'is not a function' 오류 방지
export function getQuizzesByGrandUnit(grandUnit: GrandUnit): QuizPassage[] {
  return quizPassages.filter((q) => q.grandUnit === grandUnit);
}

export function getQuizzesByCategory(categoryId: string): QuizPassage[] {
  return quizPassages.filter((q) => q.categoryId === categoryId);
}
export function getQuizById(id: string): QuizPassage | undefined {
  return quizPassages.find((q) => q.id === id);
}

// 데이터 배열 시작
export const quizPassages: QuizPassage[] = [
  {
    id: "classic-novel-yucr-1",
    grandUnit: "literature",
    categoryId: "classic-novel",
    title: "유충렬전",
    author: "작자 미상",
    source: "수능특강 문학 112p",
    passage:
      '충렬이 나이 겨우 다섯 살이라. 어머니 장씨 부인이 아이를 안고 피란하다가 정한담의 군사에게 잡히니, 장씨 부인은 바위 아래로 몸을 던져 목숨을 끊으려 하거늘, 하늘이 이 충신의 자식을 버리지 아니하여 한 줄기 오색 구름이 내려와 아이를 감싸니, 군사들이 놀라 물러가더라.\n\n이때 한 노승이 지나다가 아이의 울음소리를 듣고 찾아와 안아 들고 탄식하여 왈,\n"이 아이는 장차 나라를 구할 재목이로다. 내 마땅히 데려가 기르리라."\n하고 아이를 업고 깊은 산중으로 들어가니라.',
    narrativePhase: "exposition",
    narrativeSections: [
      {
        phase: "exposition",
        title: "유충렬의 위기",
        summary: "어린 충렬이 역적 정한담의 난으로 가족을 잃고 노승에게 구출됨",
      },
      {
        phase: "rising",
        title: "성장과 수련",
        summary: "산중에서 무예와 학문을 연마하며 영웅으로 성장",
      },
      {
        phase: "climax",
        title: "전장의 영웅",
        summary: "조정의 위기에 출전하여 적장들을 차례로 격파",
      },
      {
        phase: "falling",
        title: "정한담 토벌",
        summary: "역적 정한담을 정벌하고 부모의 원수를 갚음",
      },
      {
        phase: "resolution",
        title: "충효의 완성",
        summary: "공을 인정받아 벼슬에 오르고 부모와 재회",
      },
    ],
    characterMap: {
      characters: [
        {
          name: "유충렬",
          role: "주인공",
          description: "충신 유심의 아들, 영웅적 장수",
        },
        {
          name: "유심",
          role: "아버지",
          description: "충신, 정한담의 모함으로 유배",
        },
        {
          name: "장씨 부인",
          role: "어머니",
          description: "충렬의 어머니, 절개를 지킴",
        },
        {
          name: "정한담",
          role: "적대자",
          description: "간신, 나라를 어지럽히는 역적",
        },
        {
          name: "노승",
          role: "조력자",
          description: "충렬을 구하고 무예를 가르침",
        },
        { name: "임금", role: "군주", description: "위기에 처한 조정의 왕" },
      ],
      relations: [
        { from: "유충렬", to: "유심", type: "family", label: "부자" },
        { from: "유충렬", to: "장씨 부인", type: "family", label: "모자" },
        { from: "유충렬", to: "노승", type: "supporter", label: "스승-제자" },
        { from: "유충렬", to: "정한담", type: "antagonist", label: "적대" },
        { from: "유충렬", to: "임금", type: "supporter", label: "충성" },
        { from: "정한담", to: "유심", type: "antagonist", label: "모함" },
        { from: "정한담", to: "임금", type: "antagonist", label: "반역" },
      ],
    },
    questions: [
      {
        id: "cn-yucr1-q1",
        statement:
          "'오색 구름'은 하늘이 유충렬을 보호하는 초월적 존재임을 나타낸다.",
        isTrue: true,
        explanation:
          "오색 구름은 천상적 존재의 개입을 상징하며, 유충렬이 하늘의 보호를 받는 비범한 인물임을 보여줍니다. 이는 영웅소설의 전형적인 '천우신조(天佑神助)' 모티프입니다.",
      },
      {
        id: "cn-yucr1-q2",
        statement:
          "장씨 부인이 바위 아래로 몸을 던지려 한 것은 비겁한 도주의 행위이다.",
        isTrue: false,
        explanation:
          "장씨 부인의 행위는 비겁한 도주가 아니라, 적에게 잡혀 욕을 당하느니 목숨을 끊겠다는 열녀의 절개를 보여주는 것입니다. 이는 유교적 가치관에서 높이 평가되는 행위입니다.",
      },
      {
        id: "cn-yucr1-q3",
        statement: "노승은 유충렬의 미래 역할을 예견하는 인물이다.",
        isTrue: true,
        explanation:
          "'장차 나라를 구할 재목'이라는 노승의 말은 예언적 기능을 합니다. 영웅소설에서 조력자가 주인공의 비범함을 알아보고 양육하는 것은 전형적 서사 구조입니다.",
      },
      {
        id: "cn-yucr1-q4",
        statement:
          "이 장면은 시간의 흐름에 따라 사건이 순차적으로 전개되고 있다.",
        isTrue: true,
        explanation:
          "피란 → 포위 → 장씨 부인의 결심 → 오색 구름의 구원 → 노승의 등장 순으로 시간 순서에 따라 사건이 전개되며, 이는 고전소설의 전형적인 순행적 구조입니다.",
      },
    ],
    relatedExams: [
      {
        id: "re-yucr1-1",
        sourceTitle: "2024학년도 수능",
        statement:
          "고전 영웅소설에서 주인공의 고난은 후일 영웅적 활약의 서사적 필연성을 갖는다.",
        isTrue: true,
        explanation:
          "영웅소설의 주인공이 어린 시절 겪는 고난(가족 이산, 생명 위협)은 이후 영웅으로 성장하여 원수를 갚고 나라를 구하는 서사의 필연적 전제가 됩니다. '고난 → 성장 → 활약'의 구조입니다.",
      },
      {
        id: "re-yucr1-2",
        sourceTitle: "2023학년도 6월 평가원",
        statement:
          "이 작품의 서술자는 전지적 시점에서 인물의 내면까지 서술하고 있다.",
        isTrue: false,
        explanation:
          "이 장면에서 서술자는 인물의 행동과 외적 상황을 서술할 뿐, 내면 심리를 직접 서술하지 않습니다. '목숨을 끊으려 하ﱰ늘'은 행동 묘사이지 내면 서술이 아닙니다.",
      },
    ],
  },
  {
    id: "modern-poem-1",
    grandUnit: "literature",
    categoryId: "modern-poetry",
    title: "진달래꽃",
    author: "김소월",
    source: "수능특강 문학 45p",
    passage:
      "나 보기가 역겨워\n가실 때에는\n말없이 고이 보내 드리우리다\n\n영변에 약산\n진달래꽃\n아름 따다 가실 길에 뿌리우리다\n\n가시는 걸음걸음\n놓인 그 꽃을\n사뿐히 즈려밟고 가시옵소서\n\n나 보기가 역겨워\n가실 때에는\n죽어도 아니 눈물 흘리우리다",
    questions: [
      {
        id: "mp1-q1",
        statement: "이 시의 화자는 임과의 이별을 체념적으로 수용하고 있다.",
        isTrue: false,
        explanation:
          "화자는 겉으로는 체념한 듯 보이지만, '죽어도 아니 눈물 흘리우리다'라는 역설적 표현을 통해 이별의 슬픔을 극대화하고 있습니다.",
      },
      {
        id: "mp1-q2",
        statement: "이 시는 7·5조의 전통적 민요 율격을 활용하고 있다.",
        isTrue: true,
        explanation:
          "김소월의 시는 한국 전통 민요의 7·5조 율격을 바탕으로 하여 한국적 정서를 효과적으로 전달하고 있습니다.",
      },
      {
        id: "mp1-q3",
        statement: "'진달래꽃'은 화자의 기쁨과 희망을 상징하는 소재이다.",
        isTrue: false,
        explanation:
          "진달래꽃은 화자의 사랑과 헌신을 상징합니다. 떠나는 임의 길에 꽃을 뿌린다는 것은 슬픔을 내면화하는 행위입니다.",
      },
      {
        id: "mp1-q4",
        statement:
          "이 시에서 화자는 자신의 감정을 행동으로 간접 전달하고 있다.",
        isTrue: true,
        explanation:
          "'고이 보내 드리우리다', '가실 길에 뿌리우리다' 등 구체적인 행동 묘사를 통해 감정을 간접적으로 전달하고 있습니다.",
      },
    ],
    relatedExams: [
      {
        id: "re-mp1-1",
        sourceTitle: "2023학년도 수능",
        statement:
          "화자가 꽃을 뿌리는 행위는 이별의 슬픔을 의식적으로 억제하려는 태도를 보여준다.",
        isTrue: true,
        explanation:
          "화자는 이별의 고통을 겉으로 드러내지 않고, 꽃을 뿌리는 행위를 통해 아름다운 이별을 연출하면서 슬픔을 내면화하고 있습니다.",
      },
      {
        id: "re-mp1-2",
        sourceTitle: "2022학년도 9월 평가원",
        statement:
          "'사뿐히 즈려밟고'는 화자가 임에게 고통을 주고 싶은 마음을 표현한 것이다.",
        isTrue: false,
        explanation:
          "이는 임에게 고통을 주려는 것이 아니라, 임의 발걸음을 편안하게 해주려는 자기희생적 사랑의 역설적 표현입니다.",
      },
    ],
  },
  {
    id: "modern-poem-gil",
    grandUnit: "literature",
    categoryId: "modern-poetry",
    title: "길",
    author: "김소월",
    source: "2027학년도 EBS 수능특강 문학 008~009쪽",
    passage:
      "어제도 하룻밤\n나그네 집에\n가마귀 가와가와 울며 새었소.\n\n오늘은\n또 몇 십 리\n어디로 갈까.\n\n산으로 올라갈까\n들로 갈까\n오라는 곳이 없어 나는 못 가오.\n\n말 마소 내 집도\n정주(定州) 곽산(郭山)\n차(車) 가고 배 가는 곳이라오.\n\n여보소 공중에\n저 기러기\n공중엔 길 있어서 잘 가는가?\n\n여보소 공중에\n저 기러기\n열 십자(十字) 복판에 내가 섰소.\n\n갈래갈래 갈린 길\n길이라도\n내게 바이 갈 길은 하나 없소.",
    questions: [
      {
        id: "mp-gil-q1",
        statement:
          "이 시는 '-오', '-소' 등의 종결 어미를 반복하여 운율을 형성하고 있다.",
        isTrue: true,
        explanation:
          "각 연의 종결 어미를 '-오', '-소' 등으로 반복하여 사용하여 규칙적인 리듬감(각운)을 형성하고 있습니다.",
      },
      {
        id: "mp-gil-q2",
        statement:
          "이 시는 의문형 종결 방식을 통해 시 전체의 율격 통일성을 완벽하게 맞추고 있다.",
        isTrue: false,
        explanation:
          "'공중엔 길 있어서 잘 가는가?'와 같은 의문형 종결은 화자의 정서(부러움, 한탄)를 부각하기 위한 것이지, 율격의 통일성을 위한 장치는 아닙니다.",
      },
      {
        id: "mp-gil-q3",
        statement: "이 시에서 '기러기'와 화자는 처지가 대조되는 대상이다.",
        isTrue: true,
        explanation:
          "공중에 길이 있어 자유롭게 날아가는 '기러기'와, 갈림길(열 십자 복판)에 서서 갈 곳 몰라 하는 '화자'의 처지는 서로 대조(대비)됩니다.",
      },
      {
        id: "mp-gil-q4",
        statement:
          "화자는 관념 속에서 종교적 진리를 구하기 위해 방황하고 있다.",
        isTrue: false,
        explanation:
          "이 시의 화자는 일제 강점기라는 현실적 고난 속에서 삶의 터전을 잃고 떠도는 유랑민입니다. 종교적 진리 탐구와는 거리가 멉니다.",
      },
      {
        id: "mp-gil-q5",
        statement:
          "'정주 곽산'은 화자가 가고 싶어도 갈 수 없는 고향을 의미한다.",
        isTrue: true,
        explanation:
          "'차 가고 배 가는 곳'이라며 구체적인 지명을 언급하지만, '내 집'인 고향에 갈 수 없는 화자의 안타까운 처지를 부각하고 있습니다.",
      },
    ],
    relatedExams: [
      {
        id: "re-mp-gil-1",
        sourceTitle: "2011학년도 9월 평가원",
        statement:
          "'기러기'는 화자와 동일한 처지에 놓인 대상으로, 화자의 슬픔을 심화하는 객관적 상관물이다.",
        isTrue: false,
        explanation:
          "기러기는 공중에 길이 있어 자유롭게 날아가는 존재로, 갈림길에 서서 갈 곳 몰라 하는 화자의 처지와 '대조'되는 대상입니다. (동일한 처지 X)",
      },
      {
        id: "re-mp-gil-2",
        sourceTitle: "2011학년도 9월 평가원",
        statement:
          "'열 십자(十字) 복판'은 화자가 나아가야 할 삶의 방향을 깨닫게 되는 희망적 공간이다.",
        isTrue: false,
        explanation:
          "열 십자 복판은 갈래갈래 갈린 길의 한가운데로, 어디로 가야 할지 몰라 방황하는 화자의 '방향 상실'과 '절망'을 보여주는 공간입니다.",
      },
      {
        id: "re-mp-gil-3",
        sourceTitle: "2011학년도 9월 평가원",
        statement:
          "'정주 곽산'은 화자가 현재 가고 있는 목적지이며, 곧 도착할 수 있다는 확신을 보여준다.",
        isTrue: false,
        explanation:
          "정주 곽산은 화자의 집이 있는 곳이지만, '차 가고 배 가는 곳'이라며 자신은 갈 수 없는 처지임을 부각하고 있습니다. 목적지가 아닌 상실한 고향을 의미합니다.",
      },
      {
        id: "re-mp-gil-4",
        sourceTitle: "2011학년도 9월 평가원",
        statement:
          "화자는 관념적인 세계 속에서 인생의 진리를 탐구하거나 종교적 구원을 갈망하고 있다.",
        isTrue: false,
        explanation:
          "이 시는 삶의 터전을 잃고 유랑하는 민족의 비애를 다룬 작품으로, 화자가 관념 속에서 진리를 찾거나 종교적 구원을 바라는 태도는 나타나지 않습니다.",
      },
      {
        id: "re-mp-gil-5",
        sourceTitle: "2011학년도 9월 평가원",
        statement:
          "'가마귀'가 울며 새는 청각적 이미지는 화자의 암울하고 비극적인 정서를 고조시킨다.",
        isTrue: true,
        explanation:
          "가마귀의 울음소리는 나그네의 고단한 여정과 어우러져 시 전체의 애상적이고 비극쿽����인 분위기를 형성하는 소재입니다.",
      },
      {
        id: "re-mp-gil-6",
        sourceTitle: "2011학년도 9월 평가원",
        statement:
          "'오늘'과 '내일'의 시간적 대비를 통해 화자의 상황이 개선될 것임을 암시한다.",
        isTrue: false,
        explanation:
          "이 시에는 '어제도 하룻밤', '오늘은 또 몇 십 리'라는 표현을 통해 정처 없는 유랑의 시간이 반복되고 있음을 보여줄 뿐, 상황 개선의 암시는 드러나지 않습니다.",
      },
    ],
  },
  {
    id: "modern-poem-stars",
    grandUnit: "literature",
    categoryId: "modern-poetry",
    title: "하나씩의 별",
    author: "이용악",
    source: "2027학년도 수능특강 32p",
    passage:
      "무엇을 실었느냐 화물 열차의\n검은 문들은 탄탄히 잠겨졌다\n\n바람 속을 달리는 화물 열차의 지붕 위에\n우리 제각기 드러누워\n한결같이 쳐다보는 하나씩의 별\n\n두만강 저쪽에서 온다는 사람들과\n자무스에서 온다는 사람들과\n험한 땅에서 험한 변 치르고\n눈보라 치기 전에 고향으로 돌아간다는\n남도 사람들과\n\n북어 쪼가리 초담배 밀가루떡이랑\n나눠서 요기하며 내사 서울이 그리워\n고향과는 딴 방향으로 흔들려 간다\n\n푸르른 바다와 거리 거리를\n설움 많은 이민 열차의 흐린 창으로\n그저 서러이 내다보던 골짝 골짝을\n갈 때와 마찬가지로\n헐벗은 채 돌아오는 이 사람들과\n마찬가지로 헐벗은 나요\n\n나라에 기쁜 일 많아\n울지를 못하는 함경도 사내\n총을 안고 볼가의 노래를 부르던\n슬라브의 늙은 병정은 잠이 들었나\n\n바람 속을 달리는 화물 열차의 지붕 위에\n우리 제각기 드러누워\n한결같이 쳐다보는 하나씩의 별",
    questions: [
      {
        id: "mp-stars-q1",
        statement:
          "이 시의 화자는 '화물 열차'의 안락한 객실에서 고향으로 돌아가고 있다.",
        isTrue: false,
        explanation:
          "화자와 사람들은 객실이 아닌 '화물 열차의 지붕 위'에 드러누워 이동하고 있습니다. 이는 해방 직후 혼란스럽고 열악했던 귀향 상황을 보여줍니다.",
      },
      {
        id: "mp-stars-q2",
        statement:
          "'검은 문'이 '탄탄히 잠겨졌다'는 표현은 귀향하는 유이민들의 앞날이 순탄치 않을 것임을 암시한다.",
        isTrue: true,
        explanation:
          "화물 열차의 굳게 닫힌 검은 문은 답답하고 불투명한 미래, 혹은 유이민들이 마주할 현실적 시련을 시각적으로 형상화한 것입니다.",
      },
      {
        id: "mp-stars-q3",
        statement:
          "'하나씩의 별'은 유이민들이 제각기 품고 있는 고향에 대한 그리움이나 미래에 대한 희망을 상징한다.",
        isTrue: true,
        explanation:
          "비록 몸은 춥고 헐벗었지만, 지붕 위에서 모두가 '한결같이' 별을 쳐다보는 행위는 각자의 마음속에 품은 희망과 소망을 의미합니다.",
      },
      {
        id: "mp-stars-q4",
        statement:
          "화자는 자신을 '남도 사람들'과 구별하며 그들에 대해 비판적인 태도를 보이고 있다.",
        isTrue: false,
        explanation:
          "화자는 그들과 음식을 나누어 먹고, '갈 때와 마찬가지로 헐벗은 채 돌아오는' 처지가 자신과 같다고 인식하며 강한 동질감(동지애)을 느끼고 있습니다.",
      },
      {
        id: "mp-stars-q5",
        statement:
          "'내사 서울이 그리워 / 고향과는 딴 방향으로 흔들려 간다'는 화자가 고향을 잊고 출세를 위해 서울로 향함을 의미한다.",
        isTrue: false,
        explanation:
          "이는 화자의 목적지가 물리적인 고향(북쪽)이 아닌 서울임을 나타내거나, 분단이나 이념 대립 등 당시의 시대적 상황으로 인해 고향으로 직행하지 못하는 복잡한 처지를 드러낸 것입니다. 출세 지향과는 거리가 멉니다.",
      },
      {
        id: "mp-stars-q6",
        statement:
          "'울지를 못하는 함경도 사내'라는 표현에는 해방의 기쁨 속에서도 마음껏 울 수 없는 화자의 비애가 담겨 있다.",
        isTrue: true,
        explanation:
          "'나라에 기쁜 일(해방)'이 많음에도 불구하고 개인적·민족적 현실의 비극성 때문에 울음조차 삼켜야 하는 화자의 복합적인 심리를 '함경도 사내'라는 투박한 호칭으로 표현했습니다.",
      },
      {
        id: "mp-stars-q7",
        statement:
          "이 시는 수미상관의 구조를 사용하여 시적 여운을 주고 주제 의식을 강조하고 있다.",
        isTrue: true,
        explanation:
          "1연의 내용(화물 열차 지붕 위, 별)이 마지막 연에서 변주되어 반복됨으로써 구조적 안정감을 주고 유이민들의 고단하지만 희망을 잃지 않는 모습을 강조합니다.",
      },
    ],
    relatedExams: [
      {
        id: "re-stars-1",
        sourceTitle: "2021학년도 수능",
        statement:
          "[연관 작품: 이용악, '그리움'] 이 시의 화자는 '화물차'를 타는 행위를 통해 고향에 대한 그리움을 해소하고 있다.",
        isTrue: false,
        explanation:
          "이 시에서 '화물차'는 화자가 직접 타고 이동하는 수단이 아니라, 고향(북쪽)을 떠올리며 상상하는 매개체이거나 과거의 기억입니다. 화자는 현재 '잉크병 얼어드는 밤'에 홀로 깨어 그리워만 하고 있으므로 그리움이 해소된 것은 아닙니다.",
        relatedPassage:
          "눈이 오는가 북쪽엔\n함박눈 쏟아져 내리는가\n\n험한 벼랑을 굽이굽이 돌아간\n백무선 철길 위에\n느릿느릿 밤새어 달리는\n화물차의 검은 지붕에\n\n연달린 산과 산 사이\n너를 남기고 온\n작은 마을에도 복된 눈 내리는가\n\n잉크병 얼어드는 이러한 밤에\n어쩌자고 잠을 깨어\n그리운 곳 차마 그리운 곳\n\n눈이 오는가 북쪽엔\n함박눈 쏟아져 내리는가",
      },
      {
        id: "re-stars-2",
        sourceTitle: "2021학년도 수능",
        statement:
          "[연관 작품: 이용악, '그리움'] '잉크병 얼어드는 밤'이라는 배경은 화자가 처한 현실의 고달픔과 고향에 대한 안타까움을 부각한다.",
        isTrue: true,
        explanation:
          "잉크병이 얼 정도의 추운 방(현실)은 화자의 고독과 가난을 감각적으로 보여주며, 이런 상황에서 떠올리는 '복된 눈' 내리는 고향의 이미지는 그리움과 안타까움을 더욱 심화시킵니다.",
        relatedPassage:
          "눈이 오는가 북쪽엔\n함박눈 쏟아져 내리는가\n\n험한 벼랑을 굽이굽이 돌아간\n백무선 철길 위에\n느릿느릿 밤새어 달리는\n화물차의 검은 지붕에\n\n연달린 산과 산 사이\n너를 남기고 온\n작은 마을에도 복된 눈 내리는가\n\n잉크병 얼어드는 이러한 밤에\n어쩌자고 잠을 깨어\n그리운 곳 차마 그리운 곳\n\n눈이 오는가 북쪽엔\n함박눈 쏟아져 내리는가",
      },
    ],
  }, // ◀ 앞의 객체와 이어주는 쉼표입니다.

  {
    id: "modern-poem-spring-ruins",
    grandUnit: "literature",
    categoryId: "modern-poetry",
    title: "빼앗긴 들에도 봄은 오는가 / 초토의 시 1",
    author: "이상화 / 구상",
    source: "2027학년도 EBS 수능특강 문학 81~83p",
    passage: `(가) 빼앗긴 들에도 봄은 오는가\n지금은 남의 땅 ― 빼앗긴 들에도 봄은 오는가?\n\n나는 온몸에 햇살을 받고\n푸른 하늘 푸른 들이 맞붙은 곳으로\n가르마 같은 논길을 따라 꿈속을 가듯 걸어만 간다.\n\n입술을 다문 하늘아 들아\n내 맘에는 나 혼자 온 것 같지를 않구나\n네가 끌었느냐 누가 부르더냐 답답워라 말을 해 다오.\n\n바람은 내 귀에 속삭이며\n한 자욱도 섰지 마라 옷자락을 흔들고\n종다리는 울타리 너머 아씨같이 구름 뒤에서 반갑다 웃네.\n\n고맙게 잘 자란 보리밭아\n간밤 자정이 넘어 내리던 고운 비로\n너는 삼단 같은 머리를 감았구나 내 머리조차 가뿐하다.\n\n혼자라도 가쁘게나 가자\n마른 논을 안고 도는 착한 도랑이\n젖먹이 달래는 노래를 하고 제 혼자 어깨춤만 추고 가네.\n\n나비 제비야 깝치지 마라\n맨드라미 들마꽃에도 인사를 해야지\n아주까리기름을 바른 이가 지심 매던 그 들이라 다 보고 싶다.\n\n내 손에 호미를 쥐어 다오\n살찐 젖가슴과 같은 부드러운 이 흙을\n발목이 시도록 밟아도 보고 좋은 땀조차 흘리고 싶다.\n\n강가에 나온 아이와 같이\n짬도 모르고 끝도 없이 닫는 내 혼아\n무엇을 찾느냐 어디로 가느냐 우스웁다 답을 하려무나.\n\n나는 온몸에 풋내를 띠고\n푸른 웃음 푸른 설움이 어우러진 사이로\n다리를 절며 하루를 걷는다 아마도 봄 신령이 지폈나 보다.\n\n그러나 지금은 ― 들을 빼앗겨 봄조차 빼앗기겠네.\n\n(나) 초토의 시 1\n판잣집 유리딱지에\n아이들 얼굴이\n불타는 해바라기마냥 걸려 있다.\n\n내려쪼이던 햇발이 눈부시어 돌아선다.\n나도 돌아선다.\n울상이 된 그림자 나의 뒤를 따른다.\n\n어느 접어든 골목에서 걸음을 멈춘다.\n잿더미가 소복한 울타리에\n개나리가 망울졌다.\n\n저기 언덕을 내려 달리는\n소녀의 미소엔 앞니가 빠져\n죄 하나도 없다.\n\n나는 술 취한 듯 흥그러워진다.\n그림자 웃으며 앞장을 선다.`,
    questions: [
      {
        id: "mp-sr-q1",
        statement:
          "(가)는 자연물인 '하늘'과 '들'을 청자로 설정하\n\n여 말을 건네는 방식을 취하고 있다.",
        isTrue: true,
        explanation:
          " '입술을 다문 하늘아 들아'라는 구절에서 자연물을 의인화하여 청자로 설정하고, 답답한 심정을 토로하며 말을 건네고 있음을 알 수 있습니다.",
      },
      {
        id: "mp-sr-q2",
        statement:
          "(가)의 마지막 연 '봄조차 빼앗기겠네'는 국권\n\n회복에 대한 화자의 강한 확신을 보여준다.",
        isTrue: false,
        explanation:
          " 마지막 연은 1연의 질문에 대한 대답으로, 국토(들)를 빼앗긴 현실 때문에 민족의 광복(봄)조차 위태롭다는 위기의식과 절망감을 드러낸 것입니다.",
      },
      {
        id: "mp-sr-q3",
        statement:
          "(가)의 '푸른 웃음 푸른 설움'은 감각의 전이(공감각적 심상)를 통해 화자의 복합적인 정서를\n\n표현한 것이다.",
        isTrue: true,
        explanation:
          " '웃음(청각/시각)'과 '설움(추상적 관념)'을 '푸른(시각)'이라는 색채 이미지로 전이시켜, 국토의 아름다움에서 오는 기쁨과 나라 잃은 슬픔이 공존하는 상태를 표현했습니다.",
      },
      {
        id: "mp-sr-q4",
        statement:
          "(나)는 6·25 전쟁 직후의 폐허를 배경으로 하여,\n\n아이들을 통해 죽음의 공포를 부각하고 있다.",
        isTrue: false,
        explanation:
          " (나)는 폐허(초토) 속에서도 '불타는 해바라기' 같은 아이들과 '소녀의 미소'를 통해 강렬한 생명력과 현실 극복의 희망을 발견하고 있습니다.",
      },
      {
        id: "mp-sr-q5",
        statement:
          "(나)에서 '그림자'가 '울상'에서 '웃음'으로 변하는 것은 화자의 태도가 절망에서 긍정으로 전환\n\n되었음을 의미한다.",
        isTrue: true,
        explanation:
          " 처음에 울상이 되어 뒤따르던 그림자가 마지막에 웃으며 앞장서는 모습은, 화자가 잿더미 속 생명력(개나리, 아이들)을 통해 희망을 감지했음을 보여줍니다.",
      },
      {
        id: "mp-sr-q6",
        statement:
          "(가)는 봄의 생동감을, (나)는 겨울의 황량함을\n\n중심으로 시상을 전개하고 있다.",
        isTrue: false,
        explanation:
          " (가)는 봄을 배경으로 하지만, (나) 역시 '개나리가 망울졌다'는 표현을 통해 계절적 배경이 봄임을 암시하고 있습니다. 황량한 것은 계절이 아니라 전쟁 직후의 현실(잿더미)입니다.",
      },
      {
        id: "mp-sr-q7",
        statement:
          "두 작품 모두 화자 자신의 분신이나 내면을 투영\n\n하는 대상('혼', '그림자')이 등장한다.",
        isTrue: true,
        explanation:
          " (가)에서는 '짬도 모르고 닫는 내 혼'을 아이에 비유하여 성찰하고, (나)에서는 '그림자'의 행동 변화를 통해 화자의 내면 심리 변화를 형상화하고 있습니다.",
      },
      {
        id: "mp-sr-q8",
        statement:
          "(가)의 '한 자욱도 섰지 마라'는 독립을 위해 멈추\n\n지 말고 투쟁하라는 행동 강령을 의미한다.",
        isTrue: false,
        explanation:
          " 이는 봄바람이 부는 역동적인 자연 현상과 그 속에서 느끼는 화자의 흥취를 표현한 것일 뿐, 독립운동의 구체적인 행동 강령이나 금기 사항을 나타내는 것이 아닙니다.",
      },
    ],
    relatedExams: [
      {
        id: "re-mp-sr-1",
        sourceTitle: "2014학년도 수능 예비평가 B형",
        statement:
          "(가)의 제1연에서 제기된 의문('봄은 오는가?')은 마지막 연에서 부정적인 예상('봄조차 빼앗기겠네')으로 귀결되어 현실의 비극성을 심화한다.",
        isTrue: true,
        explanation:
          "1연의 질문에 대해 마지막 연에서 '봄조차 빼앗길지 모른다'는 위기의식으로 답함으로써, 국권 상실의 현실이 주는 절망감을 구조적으로 완결성 있게 보여줍니다.",
      },
      {
        id: "re-mp-sr-2",
        sourceTitle: "2014학년도 수능 예비평가 B형",
        statement:
          "(가)에서 '다리를 절며' 걷는 행위는 국토의 아름다움(봄)과 국권 상실의 현실(겨울) 사이에서 느끼는 화자의 내적 부조화를 드러낸다.",
        isTrue: true,
        explanation:
          "아름다운 봄 경치에 대한 '신명'과 식민지 현실에 대한 '설움'이라는 두 가지 상반된 정서가 충돌하여, 화자의 자아가 균형을 잃고 비틀거리는 모습('다리를 절며')으로 형상화되었습니다.",
      },
      {
        id: "re-mp-sr-3",
        sourceTitle: "2014학년도 수능 예비평가 B형",
        statement:
          "(가)에서 바람이 '한 자욱도 섰지 마라'고 하는 것은 화자에게 조국 독립을 위한 시련과 고난을 멈추지 말 것을 명령하는 것이다.",
        isTrue: false,
        explanation:
          " 이는 봄바람이 화자를 스치며 옷자락을 흔드는 자연 현상을 묘사한 것으로, 화자가 봄의 정취에 흠뻑 취해 있음을 보여주는 표현이지 독립 투쟁의 명령이 아닙니다.",
      },
      {
        id: "re-mp-sr-4",
        sourceTitle: "2027학년도 EBS 수능특강",
        statement:
          "(나)에서 화자가 햇발이 눈부셔 '돌아선' 것은 비참한 현실을 외면하고 초월적 세계(달관)로 나아가려는 태도를 보여준다.",
        isTrue: false,
        explanation:
          " 화자가 돌아선 것은 폐허 속에서도 빛나는 아이들의 생명력을 보며 느낀 부끄러움이나 눈부심 때문이지, 현실을 초월하거나 달관하려는 태도가 아닙니다.",
      },
      {
        id: "re-mp-sr-5",
        sourceTitle: "2027학년도 EBS 수능특강",
        statement:
          "(나)의 '불타는 해바라기'는 전쟁의 포화 속에 희생된 아이들의 비극적 이미지를 시각화한 것이다.",
        isTrue: false,
        explanation:
          " '불타는 해바라기'는 판잣집이라는 누추한 공간과 대비되는 아이들의 강렬한 생명력과 역동성을 직유법을 통해 예찬적으로 표현한 것입니다.",
      },
      {
        id: "re-mp-sr-6",
        sourceTitle: "2027학년도 EBS 수능특강",
        statement:
          "(나)의 '개나리'는 잿더미라는 절망적 상황 속에서도 피어나는 희망의 매개체로, 화자의 정서가 전환되는 계기가 된다.",
        isTrue: true,
        explanation:
          " 화자는 잿더미 속에서 피어난 개나리를 보며 생명의 끈질김을 확인하고, 이를 통해 '흥그러워지며' 희망을 갖게 됩니다.",
      },
    ],
  },
];
