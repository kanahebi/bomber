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
    $all_char.flatten - [self]
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
    chars = $all_char - $blocks -[self]
    chars.flatten.each do |char|
      return char if char.current_block == [x, y]
    end
    return nil
  end
end