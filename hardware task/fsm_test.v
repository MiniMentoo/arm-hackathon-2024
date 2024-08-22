module fsm_test (
    input clk,
    input resetn,
    input [3:1] r,
    output reg [3:1] g
);
    
    reg [1:0] state;
    parameter IDLE = 2'b00;
    parameter DEV1 = 2'b01;
    parameter DEV2 = 2'b10;
    parameter DEV3 = 2'b11;

    always @(negedge clk)
    begin
        if (resetn == 1'b0)
            state <= IDLE;
        else
        begin
            case (state)
                IDLE:
                begin
                    if (r[1] == 1'b1)
                        state <= DEV1;
                    else if (r[2] == 1'b1)
                        state <= DEV2;
                    else if (r[3] == 1'b1)
                        state <= DEV3;
                end
                DEV1:
                begin
                    if (r[1] == 1'b0)
                        state <= IDLE;
                end
                DEV2:
                begin
                    if (r[2] == 1'b0)
                        state <= IDLE;
                end
                DEV3:
                begin
                    if (r[3] == 1'b0)
                        state <= IDLE;
                end
            endcase
        end
    end

    always @(negedge clk)
    begin
        case (state)
            IDLE:
                g <= 3'b000;
            DEV1:
                g <= 3'b001;
            DEV2:
                g <= 3'b010;
            DEV3:
                g <= 3'b100;
        endcase
    end
endmodule
