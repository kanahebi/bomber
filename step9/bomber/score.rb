module Bomber
  class Score < Bomber::Character
    def score_status
      font = new_font(20)
      width = BLOCK*20
      height = BLOCK*2
      image = Image.new(width, height)
      image.draw_font(0, (font.size + 1), "得点 #{$score} 点", font, [0, 0, 0])
      @font = Sprite.new(x+BLOCK, y-BLOCK/2 , image)
      @font.draw
    end
  end
end