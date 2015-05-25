module Bomber
  class Mori < Bomber::Character
    attr_accessor :guide, :agl
    def initialize(costume, x, y, angle)
      super
      @agl = :right
      @guide = Bomber::Guide.new(self)
      @guide.trace
    end

    def tracking(target)
      diff_x = target.current_x_block - self.current_x_block
      diff_y = target.current_y_block - self.current_y_block
      before_x = self.current_x_block
      before_y = self.current_y_block
      if diff_x.abs > diff_y.abs
        action(:move_right) if diff_x > 0
        action(:move_left)  if diff_x < 0
        if self.current_x_block == before_x
          action(:move_down) if diff_y > 0
          action(:move_up)   if diff_y < 0
        end
      else
        action(:move_down) if diff_y > 0
        action(:move_up)   if diff_y < 0
        if self.current_y_block == before_y
          action(:move_right) if diff_x > 0
          action(:move_left)  if diff_x < 0
        end
      end
      atack if rand(10)
    end
    def action(act)
      sleep 0.6
      self.send(act)
      sleep 0.2
      self.send(act)
      reject_half
    end
  end
end