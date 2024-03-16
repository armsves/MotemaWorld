use orion::operators::tensor::{Tensor, TensorTrait};
use orion::operators::tensor::{
    U32Tensor, I32Tensor, I8Tensor, FP8x23Tensor, FP16x16Tensor, FP32x32Tensor, BoolTensor
};
use orion::numbers::{FP8x23, FP16x16, FP32x32};
use orion::operators::matrix::{MutMatrix, MutMatrixImpl};
use orion::operators::nn::{NNTrait, FP16x16NN};

use node_sequential_2_dense_26_matmul_readvariableop_0::get_node_sequential_2_dense_26_matmul_readvariableop_0;
use node_sequential_2_dense_25_matmul_readvariableop_0::get_node_sequential_2_dense_25_matmul_readvariableop_0;
use node_sequential_2_dense_24_matmul_readvariableop_0::get_node_sequential_2_dense_24_matmul_readvariableop_0;
use node_sequential_2_dense_23_matmul_readvariableop_0::get_node_sequential_2_dense_23_matmul_readvariableop_0;
use node_sequential_2_dense_22_matmul_readvariableop_0::get_node_sequential_2_dense_22_matmul_readvariableop_0;
use node_sequential_2_dense_21_matmul_readvariableop_0::get_node_sequential_2_dense_21_matmul_readvariableop_0;
use node_sequential_2_dense_20_matmul_readvariableop_0::get_node_sequential_2_dense_20_matmul_readvariableop_0;
use node_sequential_2_dense_19_matmul_readvariableop_0::get_node_sequential_2_dense_19_matmul_readvariableop_0;
use node_sequential_2_dense_18_matmul_readvariableop_0::get_node_sequential_2_dense_18_matmul_readvariableop_0;


fn main(node_input_3: Tensor<FP16x16>) -> Tensor<FP16x16> {
    let node_sequential_2_dense_18_matmul_0 = TensorTrait::matmul(
        @node_input_3, @get_node_sequential_2_dense_18_matmul_readvariableop_0()
    );
    let node_sequential_2_dense_18_relu_0 = NNTrait::relu(@node_sequential_2_dense_18_matmul_0);
    let node_sequential_2_dense_19_matmul_0 = TensorTrait::matmul(
        @node_sequential_2_dense_18_relu_0,
        @get_node_sequential_2_dense_19_matmul_readvariableop_0()
    );
    let node_sequential_2_dense_19_relu_0 = NNTrait::relu(@node_sequential_2_dense_19_matmul_0);
    let node_sequential_2_dense_20_matmul_0 = TensorTrait::matmul(
        @node_sequential_2_dense_19_relu_0,
        @get_node_sequential_2_dense_20_matmul_readvariableop_0()
    );
    let node_sequential_2_dense_20_relu_0 = NNTrait::relu(@node_sequential_2_dense_20_matmul_0);
    let node_sequential_2_dense_21_matmul_0 = TensorTrait::matmul(
        @node_sequential_2_dense_20_relu_0,
        @get_node_sequential_2_dense_21_matmul_readvariableop_0()
    );
    let node_sequential_2_dense_21_relu_0 = NNTrait::relu(@node_sequential_2_dense_21_matmul_0);
    let node_sequential_2_dense_22_matmul_0 = TensorTrait::matmul(
        @node_sequential_2_dense_21_relu_0,
        @get_node_sequential_2_dense_22_matmul_readvariableop_0()
    );
    let node_sequential_2_dense_22_relu_0 = NNTrait::relu(@node_sequential_2_dense_22_matmul_0);
    let node_sequential_2_dense_23_matmul_0 = TensorTrait::matmul(
        @node_sequential_2_dense_22_relu_0,
        @get_node_sequential_2_dense_23_matmul_readvariableop_0()
    );
    let node_sequential_2_dense_23_relu_0 = NNTrait::relu(@node_sequential_2_dense_23_matmul_0);
    let node_sequential_2_dense_24_matmul_0 = TensorTrait::matmul(
        @node_sequential_2_dense_23_relu_0,
        @get_node_sequential_2_dense_24_matmul_readvariableop_0()
    );
    let node_sequential_2_dense_24_relu_0 = NNTrait::relu(@node_sequential_2_dense_24_matmul_0);
    let node_sequential_2_dense_25_matmul_0 = TensorTrait::matmul(
        @node_sequential_2_dense_24_relu_0,
        @get_node_sequential_2_dense_25_matmul_readvariableop_0()
    );
    let node_sequential_2_dense_25_relu_0 = NNTrait::relu(@node_sequential_2_dense_25_matmul_0);
    let node_sequential_2_dense_26_matmul_0 = TensorTrait::matmul(
        @node_sequential_2_dense_25_relu_0,
        @get_node_sequential_2_dense_26_matmul_readvariableop_0()
    );
    let node_dense_26 = NNTrait::sigmoid(@node_sequential_2_dense_26_matmul_0);

    node_dense_26
}
