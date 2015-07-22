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
  end
end