// pages/randDetail/index.js
let questions = []
let answers = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    type: '',
    model: '',
    subject: 1,
    index: 0,
    question: '',
    answer: '',
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let rpx = 750 / wx.getSystemInfoSync().windowWidth
    let height = wx.getSystemInfoSync().windowHeight * rpx - 102;
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
        questions = res.result;
        let rightAnswers = [];
        for(let question of questions) {
          rightAnswers.push(question.answer)
        }
        wx.setStorageSync(`${this.data.subject}_${this.data.model}_${this.data.type}_right_answers`, rightAnswers)
        let total = questions.length;
        let question = questions[this.data.index]
        this.setData({
          total,
          question,
          isShow: true
        })
      })
  },
  choose(e) {
    const answer = e.currentTarget.dataset.answer;
    answers = wx.getStorageSync(`${this.data.subject}_${this.data.model}_${this.data.type}_answers`) || []
    if(answers.length > this.data.index) {
      answers.splice(this.data.index, 1 , answer)
    } else {
      answers.push(answer)
    }

  
    wx.setStorageSync(`${this.data.subject}_${this.data.model}_${this.data.type}_answers`, answers)
    this.setData({
      answer
    })

    this.nextClick()
  },
  preClick() {
    let index = this.data.index;
    if (index === 0) return;
    index = index - 1;
    answers = wx.getStorageSync(`${this.data.subject}_${this.data.model}_${this.data.type}_answers`) || []
    let answer = ''
    let question = questions[index]
    if (answers.length > index) {
      answer = answers[index]
    }

    this.setData({
      question,
      index,
      answer
    })
  },
  nextClick() {
    let index = this.data.index;
    if (index === this.data.total) return;
    answers = wx.getStorageSync(`${this.data.subject}_${this.data.model}_${this.data.type}_answers`) || []
    index = index + 1;
    let question = questions[index]
    if (answers.length > index) {
      let answer = answers[index]
      this.setData({
        question,
        index,
        answer: answer
      })
    } else {
      this.setData({
        question,
        index,
        answer: ''
      })
    }
  },
  submit() {
    let answers = wx.getStorageSync(`${this.data.subject}_${this.data.model}_${this.data.type}_answers`)
    let times = answers.length;
    let rightAnswers = wx.getStorageSync(`${this.data.subject}_${this.data.model}_${this.data.type}_right_answers`)
    let total = rightAnswers.length;
    let score = 0;
    let scoreLists = []
    for (let i = 0; i < total; i++) {
      let obj = {
        isRight: false,
        answer: '',
        explains: '',
        rightAnswer: '',
        index: 0
      }
      if (rightAnswers[i] === answers[i]) {
        score += 1
        obj.isRight = true
      } else {
        obj.explains = questions[i].explains
      }
      obj.answer = answers[i];
      obj.index = i + 1;
      obj.rightAnswer = rightAnswers[i]
      scoreLists.push(obj)
    }
    wx.setStorageSync('answeredLists', scoreLists)
    wx.showModal({
      title: '提示',
      content: `您已经回答了${times}题，还有${total - times}题未回答，是否确定交卷？`,
      cancelColor: '#ccc',
      confirmColor: '#1DACF9',
      success: res => {
        if(res.confirm) {
          wx.navigateTo({
            url: `/pages/result/index?score=${score}`,
          })
        }
      }
    })
  }
})