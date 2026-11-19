// 인공지능(AI) 학습 로드맵 데이터 (7 Part · 70강) — 'From Mathematical Foundations to Scientific AI'
//
// 작성 규칙은 numerical-roadmap.ts와 같다.
// - 강의 번호는 배열 순서로 자동 계산된다. URL은 slug로 고정된다(/ai/<slug>/ = /ai/<Part 디렉터리>/<강의 id>/).
// - status를 생략하면 'planned'. 실제 강의 페이지를 작성한 뒤에만 status: 'published'를 추가한다.
// - 강의 id는 로드맵 전체에서 고유하며, 한 번 정하면 바꾸지 않는다. 제목·순서는 바꿔도 URL에 영향이 없다.
// - 난이도는 Part 단위로 정한다. 특정 강의만 다르면 강의에 level을 지정한다(공통 모델이 이미 지원).
// - 원리·알고리즘·실험이 중심이다. 독립적인 실무 사용법(API 호출, 모델 저장, 서빙 코드 등)은 Coding Skills에서 다룬다.
// - 승인된 원고는 lecture-source/ai/lecture-XX.md에 보관한다.
import { defineRoadmap } from '../lib/roadmap';

export const aiRoadmap = defineRoadmap({
  id: 'ai',
  basePath: 'ai',
  title: '인공지능',
  searchExamples: ['경사하강법', 'Transformer'],
  parts: [
    {
      id: 'foundations',
      title: '인공지능과 머신러닝의 기초',
      en: 'Foundations of Artificial Intelligence',
      level: 'intro',
      summary:
        'AI와 머신러닝의 기본 개념을 이해하고, 수학적 원리와 간단한 알고리즘을 직접 구현합니다. NumPy·Matplotlib으로 선형회귀와 경사하강법을 만들어 봅니다.',
      lectures: [
        { id: 'how-ai-learns', title: '인공지능은 어떻게 학습하는가?', en: 'How Does AI Learn?', slug: 'foundations/how-ai-learns', keywords: ['artificial intelligence', '학습'] },
        { id: 'ml-vs-dl', title: '머신러닝과 딥러닝은 무엇이 다른가?', en: 'Machine Learning vs. Deep Learning', slug: 'foundations/ml-vs-dl', keywords: ['machine learning', 'deep learning'] },
        { id: 'patterns-in-data', title: '데이터에서 패턴을 찾는다는 의미', en: 'What It Means to Find Patterns in Data', slug: 'foundations/patterns-in-data', keywords: ['데이터', 'pattern'] },
        { id: 'linear-regression-intro', title: '선형회귀는 어떻게 예측하는가?', en: 'How Linear Regression Makes Predictions', slug: 'foundations/linear-regression-intro', keywords: ['linear regression'] },
        { id: 'loss-function', title: '손실함수는 왜 필요한가?', en: 'Why Do We Need a Loss Function?', slug: 'foundations/loss-function', keywords: ['loss', 'MSE', '평균제곱오차'] },
        { id: 'gradient-descent', title: '경사하강법은 어떻게 학습하는가?', en: 'How Gradient Descent Learns', slug: 'foundations/gradient-descent', keywords: ['gradient descent', '학습률', 'learning rate'] },
        { id: 'derivatives-in-ai', title: '미분과 편미분은 AI에서 어떻게 사용되는가?', en: 'Derivatives and Partial Derivatives in AI', slug: 'foundations/derivatives-in-ai', keywords: ['gradient', '기울기', '편미분'] },
        { id: 'train-test-split', title: '학습과 테스트 데이터를 왜 나누는가?', en: 'Why Split Training and Test Data?', slug: 'foundations/train-test-split', keywords: ['train', 'test', '검증 데이터', 'validation'] },
        { id: 'overfitting-intro', title: '과적합은 왜 발생하는가?', en: 'Why Does Overfitting Happen?', slug: 'foundations/overfitting-intro', keywords: ['overfitting', '일반화', 'generalization'] },
        { id: 'first-ml-model', title: '첫 번째 머신러닝 모델 완성하기', en: 'Building Your First Machine Learning Model', slug: 'foundations/first-ml-model', keywords: ['NumPy', 'Matplotlib'] },
      ],
    },
    {
      id: 'classical-ml',
      title: '전통적인 머신러닝 알고리즘',
      en: 'Classical Machine Learning',
      level: 'basic',
      summary:
        '대표적인 지도학습·비지도학습 알고리즘의 원리와 특징을 이해합니다. 핵심 계산을 직접 구현하고 scikit-learn 결과와 비교합니다.',
      lectures: [
        { id: 'supervised-unsupervised', title: '지도학습과 비지도학습', en: 'Supervised and Unsupervised Learning', slug: 'classical-ml/supervised-unsupervised', keywords: ['supervised', 'unsupervised'] },
        { id: 'regularized-regression', title: '선형회귀와 정규화', en: 'Linear Regression and Regularization', slug: 'classical-ml/regularized-regression', keywords: ['Ridge', 'Lasso', 'L1', 'L2', 'regularization'] },
        { id: 'logistic-regression', title: '로지스틱 회귀와 분류', en: 'Logistic Regression and Classification', slug: 'classical-ml/logistic-regression', keywords: ['logistic regression', 'sigmoid', '시그모이드', 'classification'] },
        { id: 'knn', title: 'K-Nearest Neighbors', en: 'K-Nearest Neighbors', slug: 'classical-ml/knn', keywords: ['KNN', 'k-최근접 이웃'] },
        { id: 'decision-tree', title: '결정트리의 원리', en: 'How Decision Trees Work', slug: 'classical-ml/decision-tree', keywords: ['decision tree', '엔트로피', 'entropy', 'Gini'] },
        { id: 'random-forest', title: 'Random Forest와 앙상블', en: 'Random Forests and Ensembles', slug: 'classical-ml/random-forest', keywords: ['랜덤 포레스트', 'ensemble', 'bagging', 'boosting'] },
        { id: 'svm', title: 'Support Vector Machine', en: 'Support Vector Machines', slug: 'classical-ml/svm', keywords: ['SVM', '서포트 벡터 머신', 'kernel', '커널'] },
        { id: 'k-means', title: 'K-means 군집화', en: 'K-means Clustering', slug: 'classical-ml/k-means', keywords: ['clustering', '군집'] },
        { id: 'pca', title: 'PCA와 차원 축소', en: 'PCA and Dimensionality Reduction', slug: 'classical-ml/pca', keywords: ['주성분 분석', 'principal component analysis', 'dimensionality reduction'] },
        { id: 'model-evaluation', title: '머신러닝 모델 평가와 비교', en: 'Evaluating and Comparing ML Models', slug: 'classical-ml/model-evaluation', keywords: ['교차 검증', 'cross-validation', 'precision', 'recall', 'F1'] },
      ],
    },
    {
      id: 'deep-learning',
      title: '딥러닝의 수학적 원리와 구현',
      en: 'Deep Learning Fundamentals',
      level: 'intermediate',
      summary: '인공신경망의 구조와 학습 원리를 이해하고, 역전파를 직접 구현한 뒤 PyTorch로 모델을 만듭니다.',
      lectures: [
        { id: 'perceptron', title: '퍼셉트론과 인공신경망', en: 'Perceptrons and Artificial Neural Networks', slug: 'deep-learning/perceptron', keywords: ['perceptron', 'neural network', '신경망'] },
        { id: 'activation-functions', title: '활성화 함수의 역할', en: 'The Role of Activation Functions', slug: 'deep-learning/activation-functions', keywords: ['ReLU', 'sigmoid', 'tanh', 'activation'] },
        { id: 'mlp', title: '다층 퍼셉트론(MLP)', en: 'Multilayer Perceptrons (MLP)', slug: 'deep-learning/mlp', keywords: ['multilayer perceptron'] },
        { id: 'backpropagation', title: '역전파 알고리즘', en: 'The Backpropagation Algorithm', slug: 'deep-learning/backpropagation', keywords: ['backpropagation', '연쇄법칙', 'chain rule'] },
        { id: 'optimizers', title: '최적화 알고리즘(SGD, Adam)', en: 'Optimization Algorithms (SGD, Adam)', slug: 'deep-learning/optimizers', keywords: ['SGD', 'Adam', 'momentum', 'optimizer'] },
        { id: 'dl-regularization', title: '과적합과 정규화', en: 'Overfitting and Regularization in Deep Learning', slug: 'deep-learning/dl-regularization', keywords: ['dropout', '드롭아웃', 'weight decay', 'batch normalization'] },
        { id: 'cnn', title: 'CNN의 원리', en: 'How CNNs Work', slug: 'deep-learning/cnn', keywords: ['합성곱 신경망', 'convolution', 'convolutional neural network'] },
        { id: 'image-classification', title: '이미지 분류 모델 구현', en: 'Implementing an Image Classifier', slug: 'deep-learning/image-classification', keywords: ['image classification', 'MNIST'] },
        { id: 'rnn', title: 'RNN과 시퀀스 모델', en: 'RNNs and Sequence Models', slug: 'deep-learning/rnn', keywords: ['recurrent neural network', 'LSTM', 'GRU', '순환 신경망'] },
        { id: 'pytorch-project', title: 'PyTorch로 딥러닝 프로젝트 완성하기', en: 'Completing a Deep Learning Project with PyTorch', slug: 'deep-learning/pytorch-project', keywords: ['PyTorch'] },
      ],
    },
    {
      id: 'generative',
      title: 'Transformer와 생성형 AI',
      en: 'Modern AI and Generative Models',
      level: 'advanced',
      summary: '현대 AI의 핵심 구조인 Attention과 Transformer를 수식으로 이해하고, 생성형 모델의 동작 원리를 학습합니다.',
      lectures: [
        { id: 'what-is-generative-ai', title: '생성형 AI란 무엇인가?', en: 'What Is Generative AI?', slug: 'generative/what-is-generative-ai', keywords: ['generative AI'] },
        { id: 'word-embedding', title: 'Word Embedding과 벡터 표현', en: 'Word Embeddings and Vector Representations', slug: 'generative/word-embedding', keywords: ['임베딩', 'word2vec', 'embedding'] },
        { id: 'attention', title: 'Attention 메커니즘', en: 'The Attention Mechanism', slug: 'generative/attention', keywords: ['어텐션'] },
        { id: 'self-attention', title: 'Self-Attention의 수학적 원리', en: 'The Mathematics of Self-Attention', slug: 'generative/self-attention', keywords: ['셀프 어텐션', 'query', 'key', 'value', 'softmax'] },
        { id: 'transformer', title: 'Transformer 아키텍처', en: 'The Transformer Architecture', slug: 'generative/transformer', keywords: ['트랜스포머', 'encoder', 'decoder', 'positional encoding'] },
        { id: 'llm-training', title: '대규모 언어모델(LLM)의 학습 원리', en: 'How Large Language Models Are Trained', slug: 'generative/llm-training', keywords: ['LLM', 'large language model', 'pretraining', '사전학습'] },
        { id: 'tokenization-generation', title: 'Tokenization과 텍스트 생성', en: 'Tokenization and Text Generation', slug: 'generative/tokenization-generation', keywords: ['토큰화', 'BPE', 'sampling', 'temperature'] },
        { id: 'diffusion-model', title: 'Diffusion Model의 원리', en: 'How Diffusion Models Work', slug: 'generative/diffusion-model', keywords: ['확산 모델', 'diffusion', 'denoising'] },
        { id: 'multimodal-ai', title: '멀티모달 AI의 구조', en: 'The Architecture of Multimodal AI', slug: 'generative/multimodal-ai', keywords: ['multimodal', 'vision-language'] },
        { id: 'transformer-from-scratch', title: '간단한 Transformer 직접 구현하기', en: 'Building a Simple Transformer from Scratch', slug: 'generative/transformer-from-scratch', keywords: ['트랜스포머', 'PyTorch'] },
      ],
    },
    {
      id: 'engineering',
      title: 'AI 시스템 설계와 개발',
      en: 'AI Engineering',
      level: 'advanced',
      summary:
        'AI 모델을 실제 응용 시스템에 통합하는 구조와 원리를 이해합니다. 독립적인 실무 코드(API 호출, 모델 저장·서빙 코드 등)는 Coding Skills에서 다룹니다.',
      lectures: [
        { id: 'training-vs-inference', title: 'AI 모델의 학습과 추론', en: 'Training and Inference of AI Models', slug: 'engineering/training-vs-inference', keywords: ['training', 'inference', '추론'] },
        { id: 'hugging-face-ecosystem', title: 'Hugging Face 생태계', en: 'The Hugging Face Ecosystem', slug: 'engineering/hugging-face-ecosystem', keywords: ['허깅페이스', 'Transformers'] },
        { id: 'embeddings-vector-db', title: 'Embedding과 벡터 데이터베이스', en: 'Embeddings and Vector Databases', slug: 'engineering/embeddings-vector-db', keywords: ['vector database', '벡터 검색', 'similarity search', '유사도'] },
        { id: 'rag', title: 'Retrieval-Augmented Generation(RAG)', en: 'Retrieval-Augmented Generation (RAG)', slug: 'engineering/rag', keywords: ['검색 증강 생성', 'retrieval'] },
        { id: 'fine-tuning', title: 'Fine-tuning의 원리', en: 'How Fine-tuning Works', slug: 'engineering/fine-tuning', keywords: ['파인튜닝', '미세조정'] },
        { id: 'lora-peft', title: 'LoRA와 Parameter-Efficient Fine-Tuning', en: 'LoRA and Parameter-Efficient Fine-Tuning', slug: 'engineering/lora-peft', keywords: ['LoRA', 'PEFT', 'low-rank'] },
        { id: 'tool-calling', title: 'Function Calling과 Tool Calling', en: 'Function Calling and Tool Calling', slug: 'engineering/tool-calling', keywords: ['function calling', 'tool use'] },
        { id: 'ai-agents', title: 'AI Agent의 구조', en: 'The Architecture of AI Agents', slug: 'engineering/ai-agents', keywords: ['에이전트', 'agent', 'planning'] },
        { id: 'model-serving', title: 'AI 모델 서빙과 배포', en: 'Serving and Deploying AI Models', slug: 'engineering/model-serving', keywords: ['serving', 'deployment', '배포'] },
        { id: 'evaluation-monitoring', title: 'AI 시스템 평가와 모니터링', en: 'Evaluating and Monitoring AI Systems', slug: 'engineering/evaluation-monitoring', keywords: ['evaluation', 'monitoring', '평가'] },
      ],
    },
    {
      id: 'advanced',
      title: '고급 AI 알고리즘',
      en: 'Advanced AI Algorithms',
      level: 'expert',
      summary: '강화학습, 그래프 신경망, 자기지도학습, 불확실성 추정 등 최신 AI 연구에서 활용되는 고급 알고리즘을 이해합니다.',
      lectures: [
        { id: 'reinforcement-learning', title: '강화학습의 기본 개념', en: 'Fundamentals of Reinforcement Learning', slug: 'advanced/reinforcement-learning', keywords: ['reinforcement learning', 'RL', '보상', 'reward'] },
        { id: 'mdp', title: 'Markov Decision Process', en: 'Markov Decision Processes', slug: 'advanced/mdp', keywords: ['MDP', '마르코프 결정 과정', 'Bellman', '벨만'] },
        { id: 'q-learning', title: 'Q-learning', en: 'Q-learning', slug: 'advanced/q-learning', keywords: ['Q-러닝', 'temporal difference'] },
        { id: 'deep-rl', title: 'Deep Reinforcement Learning', en: 'Deep Reinforcement Learning', slug: 'advanced/deep-rl', keywords: ['심층 강화학습', 'DQN', 'policy gradient'] },
        { id: 'gnn', title: 'Graph Neural Networks', en: 'Graph Neural Networks', slug: 'advanced/gnn', keywords: ['GNN', '그래프 신경망', 'message passing'] },
        { id: 'gcn', title: 'Graph Convolutional Networks', en: 'Graph Convolutional Networks', slug: 'advanced/gcn', keywords: ['GCN', '그래프 합성곱'] },
        { id: 'self-supervised', title: '자기지도학습', en: 'Self-Supervised Learning', slug: 'advanced/self-supervised', keywords: ['self-supervised', 'contrastive learning', '대조 학습'] },
        { id: 'transfer-learning', title: '전이학습과 도메인 적응', en: 'Transfer Learning and Domain Adaptation', slug: 'advanced/transfer-learning', keywords: ['transfer learning', 'domain adaptation'] },
        { id: 'uncertainty', title: '불확실성 추정과 신뢰할 수 있는 AI', en: 'Uncertainty Estimation and Trustworthy AI', slug: 'advanced/uncertainty', keywords: ['uncertainty', 'Bayesian', '베이지안', 'calibration'] },
        { id: 'advanced-project', title: '고급 AI 알고리즘 실험 프로젝트', en: 'Advanced AI Algorithms Project', slug: 'advanced/advanced-project', keywords: ['프로젝트', 'project'] },
      ],
    },
    {
      id: 'scientific-ai',
      title: '과학·공학 문제 해결을 위한 AI',
      en: 'AI for Scientific Computing',
      level: 'research',
      summary:
        'AI 알고리즘을 수치해석, FEM, 광학 계측, 메시 생성 등 과학·공학 문제에 적용하는 연구 지향 과정입니다. 기존 artcoding Lab 분야와 연결되는 고급 과정으로 운영합니다.',
      lectures: [
        { id: 'what-is-sciml', title: 'Scientific Machine Learning이란?', en: 'What Is Scientific Machine Learning?', slug: 'scientific-ai/what-is-sciml', keywords: ['SciML', '과학적 머신러닝'] },
        { id: 'pinn', title: 'Physics-Informed Neural Networks(PINN)', en: 'Physics-Informed Neural Networks (PINN)', slug: 'scientific-ai/pinn', keywords: ['물리 정보 신경망'] },
        { id: 'pinn-differential-equations', title: 'PINN으로 미분방정식 풀기', en: 'Solving Differential Equations with PINNs', slug: 'scientific-ai/pinn-differential-equations', keywords: ['미분방정식', 'differential equation', 'PDE', 'ODE'] },
        { id: 'neural-operator', title: 'Neural Operator의 개념', en: 'The Concept of Neural Operators', slug: 'scientific-ai/neural-operator', keywords: ['신경 연산자', 'FNO', 'DeepONet'] },
        { id: 'ai-numerical-methods', title: 'AI 기반 수치해법', en: 'AI-Based Numerical Methods', slug: 'scientific-ai/ai-numerical-methods', keywords: ['수치해석', 'numerical methods'] },
        { id: 'fem-surrogate', title: 'FEM과 AI Surrogate Model', en: 'FEM and AI Surrogate Models', slug: 'scientific-ai/fem-surrogate', keywords: ['대리 모델', 'surrogate', '유한요소법'] },
        { id: 'optical-image-restoration', title: 'AI 기반 광학 영상 복원', en: 'AI-Based Optical Image Restoration', slug: 'scientific-ai/optical-image-restoration', keywords: ['영상 복원', 'super-resolution', '초해상도', 'denoising'] },
        { id: 'gnn-mesh', title: 'Graph Neural Network와 Mesh', en: 'Graph Neural Networks and Meshes', slug: 'scientific-ai/gnn-mesh', keywords: ['GNN', '메시', 'mesh'] },
        { id: 'ai-mesh-generation', title: 'AI-driven Mesh Generation', en: 'AI-Driven Mesh Generation', slug: 'scientific-ai/ai-mesh-generation', keywords: ['메시 생성', 'adaptive meshing'] },
        { id: 'scientific-ai-project', title: 'Scientific AI 연구 프로젝트 설계', en: 'Designing a Scientific AI Research Project', slug: 'scientific-ai/scientific-ai-project', keywords: ['연구 프로젝트', 'research'] },
      ],
    },
  ],
});
