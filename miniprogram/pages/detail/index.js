let questions = []
let answers = []
Page({
  data: {
    height: 0,
    type: '',
    model: '',
    subject: 1,
    index: 0,
    question: '',
    answer: '',
    isShow: false,
    isContentShow: false
  },
  onLoad(options){
    let rpx = 750 / wx.getSystemInfoSync().windowWidth
    let height = wx.getSystemInfoSync().windowHeight * rpx  - 102;
    let answers = wx.getStorageSync(`${options.subject}_${options.model}_${options.type}_answers`) || [];
    let index = answers.length;
    this.setData({
      type: options.type,
      model: options.model,
      subject: Number(options.subject),
      height,
      index
    })
   
    this.getData()
  },
  getData() {
    wx.showLoading({
      title: '拼命加载中...',
    })
    wx.cloud.callFunction({
      name: 'questions',
      data: {
        type: this.data.type,
        model: this.data.model,
        subject: this.data.subject
      }
    })
    .then(res => {
      console.log(res)
      wx.hideLoading()
      questions = res.result.data;
      let total = res.result.total;
      let question = questions[this.data.index]
      this.setData({
        total,
        question,
        isContentShow: true
      })
    })
  },
  choose(e) {
    if(this.data.answer !== '') return;
    const answer = e.currentTarget.dataset.answer;
    answers = wx.getStorageSync(`${this.data.subject}_${this.data.model}_${this.data.type}_answers`) || []
    answers.push(answer)
    wx.setStorageSync(`${this.data.subject}_${this.data.model}_${this.data.type}_answers`, answers)
    let isShow = false;
    if(answer !== this.data.question.answer) {
      isShow = true
    }
    this.setData({
      answer,
      isShow
    })
    if (answer === this.data.question.answer) {
      this.nextClick()
    }
  },
  preClick() {
    let index = this.data.index;
    if(index === 0) return;
    index = index - 1;
    answers = wx.getStorageSync(`${this.data.subject}_${this.data.model}_${this.data.type}_answers`) || []
    let answer = ''
    let isShow = false
    let question = questions[index]
    if (answers.length > index) {
      answer = answers[index] 
      if (answer !== question.answer) {
        isShow = true
      }
    }
    
    this.setData({
      question,
      index,
      answer,
      isShow
    })
  },
  nextClick() {
    let index = this.data.index;
    if (index === this.data.total) return;
    answers = wx.getStorageSync(`${this.data.subject}_${this.data.model}_${this.data.type}_answers`) || []
    index = index + 1;
    let question = questions[index]
    let isShow = false
    if(answers.length > index) {
      let answer = answers[index]
      if(answer !== question.answer) {
        isShow = true
      }
      this.setData({
        question,
        index,
        answer: answer,
        isShow
      })
    } else {
      this.setData({
        question,
        index,
        answer: '',
        isShow: isShow
      })
    }
  }
})