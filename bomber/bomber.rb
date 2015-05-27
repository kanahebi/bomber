require "smalruby"
require "./bomber/character.rb"

Dir[File.expand_path('../bomber', __FILE__) << '/*.rb'].each do |file|
  require file
end

module Bomber
  BLOCK = 32
  def block(num)
    BLOCK * num
  end

  def other_char
    $all_obj.flatten - [self]
  end

  def hit_char
    $hit_obj.flatten - [self]
  end

  def all_enemy
    $enemy.flatten - [self]
  end

  def current_block
    [current_x_block, current_y_block]
  end

  def current_x_block
    self.x / BLOCK
  end

  def current_y_block
    self.y / BLOCK
  end

  def clicked_block
    [clicked_x_block, clicked_y_block]
  end

  def clicked_x_block
    Input.mouse_pos_x / BLOCK
  end

  def clicked_y_block
    Input.mouse_pos_y / BLOCK
  end

  def current_half?
    current_x_half? or current_y_half?
  end

  def current_x_half?
    !(self.x % BLOCK == 0)
  end

  def current_y_half?
    !(self.y % BLOCK == 0)
  end

  def char_exists?(x, y)
    !!current_char(x, y)
  end

  def current_char(x, y)
    chars = other_char - $blocks
    chars.flatten.each do |char|
      return char if char.current_block == [x, y]
    end
    return nil
  end

  def say(options = {})
    defaults = {
      message: '',
      second: 0,
    }
    opts = process_optional_arguments(options, defaults)

    message = opts[:message].to_s
    return if message == @current_message

    @current_message = message

    if @balloon
      @balloon.vanish
      @balloon = nil
    end

    return if message.empty?

    lines = message.to_s.lines.map { |l| l.scan(/.{1,10}/) }.flatten
    font = new_font(16)
    width = lines.map { |l| font.get_width(l) }.max
    height = lines.length * (font.size + 1)
    frame_size = 3
    margin_size = 3
    image = Image.new(width + (frame_size + margin_size) * 2,
                     height + (frame_size + margin_size) * 2)

    lines.each.with_index do |line, row|
      image.draw_font(frame_size + margin_size,
                    frame_size + margin_size + (font.size + 1) * row,
                    line, font, [0, 0, 0])
    end
    @balloon = Sprite.new(x, y, image)
  end
end