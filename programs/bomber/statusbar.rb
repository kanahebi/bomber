module Bomber
  class Statusbar < Bomber::Character
    def enemy_status(num)
      font = new_font(16)
      width = BLOCK
      height = BLOCK
      image = Image.new(width, height)
      image.draw_font(0, (font.size + 1), "×#{num}", font, [0, 0, 0])
      @font = Sprite.new(x+BLOCK, y-BLOCK/4 , image)
      @font.draw
    end

    def time_status#(num)
      font = new_font(20)
      width = BLOCK*20
      height = BLOCK*2
      image = Image.new(width, height)
      image.draw_font(0, (font.size + 1), "残り時間 27 秒　　　　倒した数 5 体", font, [0, 0, 0])
      @font = Sprite.new(x+BLOCK, y-BLOCK/2 , image)
      @font.draw
    end
  end
end