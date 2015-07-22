module Bomber
  class Timer < Bomber::Character
    def initialize(costume, x, y, angle, timelimit)
      @timelimit = timelimit
      @start_at = Time.now
      super(costume, x, y, angle)
    end

    def time_status
      time = (Time.now - @start_at).to_i
      font = new_font(20)
      width = BLOCK*20
      height = BLOCK*2
      image = Image.new(width, height)
      image.draw_font(0, (font.size + 1), "残り時間 #{@timelimit - time} 秒", font, [0, 0, 0])
      @font = Sprite.new(x+BLOCK, y-BLOCK/2 , image)
      @font.draw
      if @timelimit - time < 0
        gameover = Bomber::GameOver.new
        gameover.z = 10
        sleep 3
        exit
      end
    end
  end
end