module Bomber
  class Player < Bomber::Character
    attr_accessor :guide, :agl
    def initialize(x, y, angle)
      super(costume_lists, x, y, angle)
      @agl = :right
      @guide = Bomber::Guide.new(self)
      @guide.trace
    end

    def costume_lists
      ["../image/hito.png"]
    end

    def move(move_angle=:right)
      if self.agl == move_angle
        self.send("move_#{move_angle.to_s}".to_sym)
        sleep 0.1
      end
      angle_shift(move_angle)
    end

    def lose
      super
      sleep 3
      exit
    end
  end
end