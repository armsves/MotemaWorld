mod chunk0;
mod chunk1;
mod chunk2;
mod chunk3;
mod chunk4;
mod chunk5;
mod chunk6;
mod chunk7;
mod chunk8;
mod chunk9;
mod chunk10;
mod chunk11;
mod chunk12;
mod chunk13;
mod chunk14;
mod chunk15;
mod chunk16;
mod chunk17;
mod chunk18;
mod chunk19;
mod chunk20;
mod chunk21;
mod chunk22;
mod chunk23;
mod chunk24;
mod chunk25;
mod chunk26;
mod chunk27;
mod chunk28;
mod chunk29;
mod chunk30;
mod chunk31;
mod chunk32;

use orion::operators::tensor::{FP16x16Tensor, Tensor, TensorTrait};
use orion::numbers::{FixedTrait, FP16x16};

fn get_node_sequential_2_dense_23_matmul_readvariableop_0() -> Tensor<FP16x16> {
    let mut shape = array![256, 128];

    let mut data = array![];
     chunk0::compute(ref data);
     chunk1::compute(ref data);
     chunk2::compute(ref data);
     chunk3::compute(ref data);
     chunk4::compute(ref data);
     chunk5::compute(ref data);
     chunk6::compute(ref data);
     chunk7::compute(ref data);
     chunk8::compute(ref data);
     chunk9::compute(ref data);
     chunk10::compute(ref data);
     chunk11::compute(ref data);
     chunk12::compute(ref data);
     chunk13::compute(ref data);
     chunk14::compute(ref data);
     chunk15::compute(ref data);
     chunk16::compute(ref data);
     chunk17::compute(ref data);
     chunk18::compute(ref data);
     chunk19::compute(ref data);
     chunk20::compute(ref data);
     chunk21::compute(ref data);
     chunk22::compute(ref data);
     chunk23::compute(ref data);
     chunk24::compute(ref data);
     chunk25::compute(ref data);
     chunk26::compute(ref data);
     chunk27::compute(ref data);
     chunk28::compute(ref data);
     chunk29::compute(ref data);
     chunk30::compute(ref data);
     chunk31::compute(ref data);
     chunk32::compute(ref data);

    TensorTrait::new(shape.span(), data.span())
}